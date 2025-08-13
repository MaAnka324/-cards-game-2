

import Front from "../assets/Front.svg";
import X2 from "../assets/x2.svg";
import Stop from "../assets/stop.svg";
import Zero from "../assets/zero.svg";
import Front1m from "../assets/Front1m.svg";
import Component500 from "../assets/Component500.svg";
import Component1000 from "../assets/Component1000.svg";
import Cash100 from "../assets/Cash100.svg";
import Cash10 from "../assets/Cash10.svg";
import Bomb from "../assets/Bomb.svg";
// новые иконки для счетчиков
import CashIcon from "../assets/cash.1.svg";
import X2Icon from "../assets/x2.1.svg";
import ZeroIcon from "../assets/zero.1.svg";
import BombIcon from "../assets/bomb.svg";
import StopIcon from "../assets/stop.1.svg";

import React, { useState } from "react";


const imageData = [
  { src: X2, type: "x2", value: 0 },
  { src: Stop, type: "stop", value: 0 },
  { src: Zero, type: "zero", value: 0 },
  { src: Front1m, type: "money", value: 1_000_000 },
  { src: Component500, type: "money", value: 500 },
  { src: Component1000, type: "money", value: 1000 },
  { src: Cash100, type: "money", value: 100 },
  { src: Cash10, type: "money", value: 10_000 },
  { src: Bomb, type: "bomb", value: 0 },
];



  export function Welcome() {
    const [opened, setOpened] = useState(Array(9).fill(false));
    const [assigned, setAssigned] = useState<(typeof imageData[number] | null)[]>(Array(9).fill(null));
    const [money, setMoney] = useState(0);
    const [multiplier, setMultiplier] = useState(1);
    const [gameOver, setGameOver] = useState(false);

    function handleClick(idx: number) {
      if (opened[idx] || gameOver) return;
      // Найти неиспользованные картинки
      const used = assigned.filter(Boolean).map((img) => img?.src);
      const available = imageData.filter((img) => !used.includes(img.src));
      if (available.length === 0) return;
      // Выбрать случайную
      const random = available[Math.floor(Math.random() * available.length)];
      const newAssigned = [...assigned];
      newAssigned[idx] = random;
      const newOpened = [...opened];
      newOpened[idx] = true;

      // Логика подсчета
      if (random.type === "money") {
        setMoney((prev) => prev + random.value);
      } else if (random.type === "x2") {
        setMoney((prev) => prev * 2);
      } else if (random.type === "zero") {
        setMoney(0);
      } else if (random.type === "stop" || random.type === "bomb") {
        setGameOver(true);
      }

      setAssigned(newAssigned);
      setOpened(newOpened);
    }

    // Сброс игры (по желанию, можно добавить кнопку)
    // function resetGame() {
    //   setOpened(Array(9).fill(false));
    //   setAssigned(Array(9).fill(null));
    //   setMoney(0);
    //   setMultiplier(1);
    //   setGameOver(false);
    // }

    // Подсчет оставшихся по типам
    const left = {
      money: 0,
      x2: 0,
      zero: 0,
      bomb: 0,
      stop: 0,
    };
    imageData.forEach((img) => {
      const openedIdx = assigned.findIndex((a) => a && a.src === img.src);
      if (openedIdx === -1) {
        switch (img.type) {
          case "money":
            left.money++;
            break;
          case "x2":
            left.x2++;
            break;
          case "zero":
            left.zero++;
            break;
          case "bomb":
            left.bomb++;
            break;
          case "stop":
            left.stop++;
            break;
        }
      }
    });

    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-transparent">
        <div className="flex items-center gap-2 mb-4">
          <img src={CashIcon} alt="money" className="w-6 h-6" />
          <span className="text-2xl font-bold text-white drop-shadow">{money.toLocaleString()}</span>
        </div>
        <div className="grid grid-cols-3 grid-rows-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <img
              key={i}
              src={opened[i] && assigned[i] ? assigned[i]!.src : Front}
              alt="$"
              width={96}
              height={96}
              className={`w-24 h-24 select-none cursor-pointer transition-all duration-200 ${opened[i] ? "opacity-100" : "opacity-60"} ${gameOver && !opened[i] ? "grayscale" : ""}`}
              draggable={false}
              onClick={() => handleClick(i)}
              style={{ opacity: opened[i] ? 1 : 0.6 }}
            />
          ))}
        </div>
        {gameOver && (
          <div className="mt-6 text-center">
            <span className="text-lg font-bold text-red-500">Игра окончена</span>
          </div>
        )}
        {/* Счетчики оставшихся карточек по типам */}
        <div className="flex justify-center gap-6 mt-8">
          <div className="flex items-center gap-1">
            <img src={CashIcon} alt="money" className="w-7 h-7" />
            <span className="text-white font-bold text-lg">{left.money}</span>
          </div>
          <div className="flex items-center gap-1">
            <img src={X2Icon} alt="x2" className="w-7 h-7" />
            <span className="text-blue-400 font-bold text-lg">{left.x2}</span>
          </div>
          <div className="flex items-center gap-1">
            <img src={ZeroIcon} alt="zero" className="w-7 h-7" />
            <span className="text-yellow-400 font-bold text-lg">{left.zero}</span>
          </div>
          <div className="flex items-center gap-1">
            <img src={BombIcon} alt="bomb" className="w-7 h-7" />
            <span className="text-red-400 font-bold text-lg">{left.bomb}</span>
          </div>
          <div className="flex items-center gap-1">
            <img src={StopIcon} alt="stop" className="w-7 h-7" />
            <span className="text-red-400 font-bold text-lg">{left.stop}</span>
          </div>
        </div>
      </main>
    );
  }
