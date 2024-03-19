"use client"
import React, { useState, useEffect } from 'react'; // Tambahkan impor useEffect
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Image from "next/image";
import { divncon } from '../../utils/divnconquer';

function DivideConquerClient({points, inputPoints}) {
  // passing data titik digunakan sebagai state
  // Mengurutkan titik berdasarkan nilai karena pustaka ini tidak melakukan pengurutan dalam penampilan kurvanya
  // Chart component
  const converted = points && points.length > 0 
    ? points[0].map(item => ({ x: item.x, y: item.y })) 
    : [];
  const sortedInput = inputPoints && inputPoints.length 
    ? inputPoints.slice().sort((a, b) => a.x - b.x) 
    : [];

  if (sortedInput.length > 0) {
    converted.push(sortedInput[0]); //titik awal
    converted.push(sortedInput[sortedInput.length - 1]); //titik akhir
  }
  const sortedPoints = converted.length 
    ? converted.slice().sort((a, b) => a.x - b.x) 
    : [];
  console.log("Masukan titik kontrol : ");
  console.log(sortedInput);
  console.log("Hasil bezier Points dengan Algoritma Divide & Conquer : ");
  console.log(converted);

  return (
    <LineChart width={600} height={600} >
    <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" dataKey="x" domain={['auto', 'auto']} allowDataOverflow />
        <YAxis type="number" domain={['auto', 'auto']} allowDataOverflow />
        <Legend />
        <Line type="linear" dataKey="y" name="Bezier Curve" stroke="#8884d8" data={sortedPoints} dot={{ fill: 'blue' }} />
        <Line type="linear" dataKey="y" name="Control Points" stroke="#82ca9d" data={sortedInput} dot={{ fill: 'green' }} />
        <Tooltip formatter={(value, name, props) => [value, props.payload.x]} />

    </LineChart>
  );
}

function divideconqueralgorithms({ points, iteration, setBezierPoint }) {
  // Menghitung titik dengan brute force
  const calculateBezierPoints = () => {
    const numIterations = parseInt(iteration); // Pastikan numIterations berupa angka
    const curvePoints = [];
    const sorted = points.slice().sort((a, b) => a.x - b.x);
    curvePoints.push(divncon(sorted, [], [], 0, numIterations, setBezierPoint));

    setBezierPoint(curvePoints);
  };

  // Panggil calculateBezierPoints langsung
  calculateBezierPoints();
}

function PointsInput({mode, numPoints, setInputPoints, setIteration, numIterations}) {
  // Inisialisasi titik dengan objek kosong
  const [jumlahTitik, setJumlahTitik] = useState(numPoints)
  const [points, setPoints] = useState(
    Array.from({ length: jumlahTitik }, () => ({ x: '', y: '' }))
  );
  
  useEffect(() => {
    // Membuat array baru dengan panjang baru
    const updatedPoints = Array.from({ length: jumlahTitik }, (_, index) => {
      // Kalau indeks masih memiliki panjang yang sama dengan array, gunakan titik yang sudah ada
      if (index < points.length) {
        return points[index];
      } else {
        // Jika tidak, buat titik baru dengan nilai kosong
        return { x: '', y: '' };
      }
    });
    // Buat array point baru
    setPoints(updatedPoints);
  }, [jumlahTitik]);

  useEffect(() => {
    setInputPoints(points);
    console.log(points);
    console.log("Points Updated");
  }, [points]);

  // Menangani perubahan point pada input
  const handlePointChange = (index, coord, value) => {
    const updatedPoints = points.map((point, i) =>
      i === index ? { ...point, [coord]: value } : point
    );
    setPoints(updatedPoints);
    // onPointsChange(updatedPoints); // Kirim balik titik yang sudah di perbarui ke component utama
  };

  // Form input untuk titik baik untuk N points maupun 3 titik
  return (
    <div>
    {mode === 'N-Points' && (
      <div className='ml-4 space-x-4 space-y-2'>
        <label>Number of Desired Points:</label>
        <input
          type="number"
          className="bg-white text-black p-1 rounded border border-gray-300 w-[75px]"
          value={jumlahTitik}
          onChange={(e) => setJumlahTitik(Number(e.target.value))}
        />
      </div>
    )}
    <div className='flex flex-row justify-center space-x-10 translate-x-[15px] font-semibold'>
        <p>sb-X</p>
        <p>sb-Y</p>
      </div>
      {points.map((point, index) => (
        
        <div key={index} className='ml-4 space-x-4 space-y-2'>
          <label>{`Point ${index + 1}`}</label>
          <input
            type="number"
            className="bg-white text-black p-1 rounded border border-gray-300 w-[75px]"
            value={point.x}
            onChange={(e) => handlePointChange(index, 'x', Number(e.target.value))}
          />
          <input
            type="number"
            className="bg-white text-black p-1 rounded border border-gray-300 w-[75px]"
            value={point.y}
            onChange={(e) => handlePointChange(index, 'y', Number(e.target.value))}
          />
           
    </div>
    ))}
    {/* Input untuk jumlah iterasi */}
    <div className='ml-4 space-x-4 space-y-2'>
      <label>Number of Iterations:</label>
      <input type="number" className="bg-white text-black p-1 rounded border border-gray-300 w-[75px]" 
      value={numIterations} onChange={(e) => setIteration(Number(e.target.value))}/>
    </div>
    {/*  Input jumlah poin yang diinginkan (hanya untuk mode 'N-Points')  */}
    </div>
    );
}

export default function DivideConquer() {
  const [mode, setMode] = useState('3-Points'); // Kontrol mode masukkan
  const [inputPoints, setInputPoints] = useState([]); //Menyimpan inputan
  const [bezierPoints, setBezierPoints] = useState([]);
  const [iteration, setIteration] = useState();
  const [executionTime, setExecutionTime] = useState();

  // Fungsi yang mengatasi inputan
  const handleSubmit = (event) => {
    event.preventDefault(); // Mengupdate  input points
    const timeStart = performance.now();
    divideconqueralgorithms({ points: inputPoints, iteration: iteration, setBezierPoint: setBezierPoints });
    const timeEnd = performance.now();
    const timeElapsed = timeEnd-timeStart;
    setExecutionTime(timeElapsed);
  };
  
  useEffect(() => {
    // Melakukan sesuatu saat ada perubahaan inputan
    console.log("Input points changed:", inputPoints);
    console.log(inputPoints);
  }, [inputPoints]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b 
        from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit 
        lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          <code className="font-mono font-bold">Divide and Conquer Algorithms</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white 
        via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0">
            <Image
              src="/curving.png"
              alt="Vercel Logo"
              className="dark:invert"
              width={150}
              height={36}
              priority
            />
          </a>
        </div>
      </div>
      <div className="relative flex lg:flex-row md:flex-col sm:flex-col place-items-center before:absolute before:h-[300px] 
      before:w-full sm:before:w-[1000px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white 
      before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full 
      sm:after:w-[800px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl 
      after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 
      before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[1]">
        <div className="m-[25px] h-[700px] border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl 
        dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-[700px]  lg:rounded-xl lg:border 
        lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          <p className="mb-3 text-xl font-semibold">Bezier Curve Illustration</p>
          {bezierPoints.length > 0 && <DivideConquerClient points={bezierPoints} inputPoints={inputPoints}/>}
        </div>
        <div className="m-[25px]  z-50 border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl 
        dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-[400px]  lg:rounded-xl lg:border 
        lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 h-fit">
          <div className="m-4 p-4">
            <h2 className="text-xl font-semibold">Input Points</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 flex items-center space-x-4 mt-[20px]">
                <button type="button" onClick={() => setMode('3-Points')}  className={mode === '3-Points' ? 'font-bold border-b border-gray-300' : ''}>3-Points</button>
                <button type="button"onClick={() => setMode('N-Points')}  className={mode === 'N-Points' ? 'font-bold border-b border-gray-300' : ''}>N-Points</button> 
              </div>
              <div>

                {mode == '3-Points' && <PointsInput mode={mode} numPoints={3} setInputPoints={setInputPoints} numIterations={iteration} setIteration={setIteration} />}
                {mode == 'N-Points' && <PointsInput mode={mode} numPoints={5} setInputPoints={setInputPoints} numIterations={iteration} setIteration={setIteration} />}
                <p className='mt-[16px]'>Time Elapsed: {executionTime} ms</p>
              </div>
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-[35px]">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="grid gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:max-w-5xl lg:w-full lg:mb-0">
        <div className="lg:w-{150} lg:h-{75} md:w-{150} md:h-{75} sm:w-{150} sm:h-{75}"></div>
        <a
          href="/brute-force"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 
          hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Brute Force{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Generate bezier curve with Brute Force Algorithms.
          </p>
        </a>

        <a
          href="/"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 
          hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener noreferrer"
          style={{ width: '275px' }}
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Home{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}>
            The front page or main page of this project.
          </p>
        </a>
        <div className="lg:w-{150} lg:h-{75} md:w-{150} md:h-{75} sm:w-{150} sm:h-{75}"></div>
      </div>
    </div>
  );
}
