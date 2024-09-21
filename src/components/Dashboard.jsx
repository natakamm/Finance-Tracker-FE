import { useState } from "react";
import ExpensesVsIncomeBar from "./charts/ExpensesVsIncomeBar";
import ExpensesVsIncomeLine from "./charts/ExpensesVsIncomeLine";
import BasicPie from "./charts/BasicPie";
import greenWave from "../assets/greenWave2.png";
import redWave from "../assets/redWave.png";

const Dashboard = () => {
  const [bar, setBar] = useState(true);
  const [value, setValue] = useState(67);
  const [maxExp, setMaxExp] = useState({ month: "June", amount: "1600" });
  const [maxInc, setMaxInc] = useState({ month: "April", amount: "2500" });
  const toggleChart = () => {
    setBar(!bar);
  };

  const d = new Date();
  let year = d.getFullYear();

  return (
    <div className="h-screen">
      {/* Grid with fixed column and row sizes */}
      <div className="grid grid-cols-6 gap-4 h-full">
        {/* Main grid (left side) */}
        <div className="col-span-4 grid grid-cols-4 gap-4 h-full">
          {/* Income & Expenses */}
          <div className="col-span-3 bg-[#161A40] p-4 text-white rounded-3xl flex flex-col overflow-hidden">
            <div className="flex justify-between">
              <div>
                <h1 className="text-xl">Income & Expenses</h1>
                <h2>{year}</h2>
              </div>
              <div className="flex gap-6 items-center">
                <div className="flex gap-2 items-center">
                  <p className="text-xs">Expenses</p>
                  <div className="h-5 w-12 bg-[#F36712] rounded-md"></div>
                </div>
                <div className="flex gap-2 items-center">
                  <p className="text-xs">Incomes</p>
                  <div className="h-5 w-12 bg-[#08D59C] rounded-md"></div>
                </div>
                <button
                  className="text-xs font-semibold border border-solid border-cyan-700"
                  onClick={toggleChart}
                >
                  {bar ? "Line Chart" : "Bar Chart"}
                </button>
              </div>
            </div>
            {/* Chart Placeholder */}
            <div className="flex-grow flex items-center justify-center overflow-hidden">
              <div className="w-full h-full">
                {/* Add chart here */}
                {bar ? <ExpensesVsIncomeBar /> : <ExpensesVsIncomeLine />}
              </div>
            </div>
          </div>

          {/* Other Grid Items */}
          <div className="col-span-1 bg-[#161A40] p-4 text-white rounded-3xl overflow-auto flex flex-col items-center justify-around gap-6">
            <div className="flex flex-col items-center ">
              <p className="text-lg">Max. Income</p>
              <p className="text-3xl">{maxInc.amount}</p>
              <img src={greenWave} />
              <p className="text-lg">{maxInc.month}</p>
            </div>

            <div className="flex flex-col items-center ">
              <p className="text-lg">Max. Expenses</p>
              <p className="text-3xl">{maxExp.amount}</p>
              <img src={redWave} />
              <p className="text-lg">{maxExp.month}</p>
            </div>
          </div>

          <div className="col-span-2 bg-[#161A40] p-4 text-white rounded-3xl ">
            <h1 className="text-xl">Sources Income</h1>
            <div className="flex-grow flex items-center justify-center ">
              <div className="h-full max-w-full max-h-full">
                <BasicPie /> {/* Make sure to uncomment and use this */}
              </div>
            </div>
          </div>

          <div className="col-span-2 bg-[#161A40] p-4 text-white rounded-3xl ">
            <h1 className="text-xl">Sources Income</h1>
            <div className="flex-grow flex items-center justify-center ">
              <div className="h-full max-w-full max-h-full">
                <BasicPie /> {/* Make sure to uncomment and use this */}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="col-span-4 bg-[#161A40] p-4 text-white rounded-3xl overflow-hidden text-center">
            <div className="flex gap-10 items-center justify-between">
              <div className="flex flex-row items-center gap-4">
                <h2 className="text-xl text-left">Income Goal</h2>
                <h2 className="font-bold text-[#01FFB9] text-2xl">{value}%</h2>
              </div>

              {/* Progress bar */}
              <div className="flex flex-col items-end w-full">
                <p>Number/Number</p>
                <div className="w-full bg-gray-400 h-4 rounded-r-full overflow-hidden">
                  <div
                    className="h-4 rounded-r-full bg-gradient-to-r from-[#F36713] to-[#7F3BCB]"
                    style={{ width: `${value}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-2 grid grid-rows-12 gap-4 h-full">
          <div className="row-span-3 bg-[#161A40] text-white rounded-3xl overflow-auto">
            01
          </div>
          <div className="row-span-8 bg-[#161A40] text-white rounded-3xl overflow-auto">
            02
          </div>
          <div className="row-span-1 bg-gradient-to-r from-purple-600 to-indigo-900 text-white rounded-3xl overflow-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
