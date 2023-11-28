import styles from '@/styles/Home.module.css'
import { useState } from 'react'

export default function Home() {
  const [color, setColor] = useState("inherit");
  const [startPos, setStartPos] = useState([]);
  const [endPos, setEndPos] = useState([]);
  const [pathFound, setPathFound] = useState(true)

  let grid = [];
  let neighbors = {};
  for(let i = 0; i < 20; i++) {
    grid[i] = [];
    for(let j = 0; j < 25; j++) {
      grid[i].push(<button key={i + "," + j} id={i + "," + j} onClick={() => changeColor(i, j)} type="button" className={`${styles.node}`}/>);
      neighbors[[i,j]] = [];
      if(i < 19) {
        neighbors[[i,j]].push([i + 1, j]);
      }
      if(i > 0) {
        neighbors[[i,j]].push([i - 1, j]);
      }
      if(j < 24) {
        neighbors[[i,j]].push([i, j + 1]);
      }
      if(j > 0) {
        neighbors[[i,j]].push([i, j - 1]);
      }
    }
  }

  function changeColor(i, j) {
    if(color == "red") {
      if(startPos.length != 0) {
        document.getElementById(startPos[0] + "," + startPos[1]).style.backgroundColor = "inherit";
      }
      setStartPos([i,j]);
    }
    if(color == "green") {
      if(endPos.length != 0) {
        document.getElementById(endPos[0] + "," + endPos[1]).style.backgroundColor = "inherit";
      }
      setEndPos([i,j])
    }
    const elem = document.getElementById(i + "," + j);
    if(color == "blue" && elem.style.backgroundColor == "blue") {
      elem.style.backgroundColor = "inherit";
    } else {
      elem.style.backgroundColor = color;
    }
  }

  function reset() {
    setColor("inherit");
    setPathFound(true);
    setEndPos([]);
    setStartPos([]);
    for(let i = 0; i < 20; i++) {
      for(let j = 0; j < 25; j++) {
        const elem = document.getElementById(i + "," + j);
        elem.style.backgroundColor = "inherit";
      }
    }
  }

  function findPath() {
    if(startPos.length == 0 || endPos.length == 0) {
      return;
    }
    let distances = {};

    let prev = {};
    let pq = new PriorityQueue(20 * 25);


    for(let i = 0; i < 20; i++) {
      for(let j = 0; j < 25; j++) {
        distances[[i, j]] = Infinity;
        prev[[i,j]] = null;
        let elem = document.getElementById(i + "," + j);
        let color = elem.style.backgroundColor;
        if(color.localeCompare("rgb(0, 255, 0)") == 0) {
          elem.style.backgroundColor = "inherit";
        }
      }
    }
    
    distances[startPos] = 0;
    pq.enqueue(startPos, 0);


    let found = false;
    while(!found && !pq.isEmpty()) {
      let minNode = pq.dequeue();
      let currNode = minNode.element;
      for(let neighbor of neighbors[currNode]) {
        if(document.getElementById(neighbor[0] + "," + neighbor[1]).style.backgroundColor !== "blue") {
          let alt = distances[currNode] + 1;

          if(alt < distances[neighbor]) {
            distances[neighbor] = alt;
            prev[neighbor] = currNode;
            if(neighbor[0] + "," + neighbor[1] == endPos[0] + "," + endPos[1]) {
              found = true;
              break;
            }
            document.getElementById(neighbor[0] + "," + neighbor[1]).style.backgroundColor = "#ffe033";
            pq.enqueue(neighbor, distances[neighbor]);
          }
        }
      }
    }

    let currPos = prev[endPos]
    while(currPos != undefined && currPos != startPos) {
      document.getElementById(currPos[0] + "," + currPos[1]).style.backgroundColor = "#00ff00";
      currPos = prev[currPos];
    }

    if(currPos == undefined) {
      setPathFound(false)
    } else {
      setPathFound(true)
    }
  }


  return (
    <>
      <div className={`${styles.navbar}`}>
        <button type="button" onClick={() => findPath()} className={`${styles.button}`}> Find Path </button>
        <button type="button" onClick={() => setColor("red")} className={`${styles.button}`}> Set Start </button>
        <button type="button" onClick={() => setColor("green")} className={`${styles.button}`}> Set End </button>
        <button type="button" onClick={() => setColor("blue")} className={`${styles.button}`}> Set Walls </button>
        <button type="button" onClick={() => reset()} className={`${styles.button}`}> Reset </button>
        {
        !pathFound &&
          <p> NO PATH FOUND!!! </p>
        }
      </div>
      <main className={`${styles.main}`}>
        {
            grid
        }
      </main>

    </>
  )
}

class QueueElement {
  constructor(elem, priNo) {
  this.element = elem;
  this.priority = priNo;
  }
}
class PriorityQueue {
  constructor() {
      this.queArr = [];
  }
  enqueue(elem, priNo) {
      let queueElem = new QueueElement(elem, priNo);
      let contain = false;
      for (let i = 0; i < this.queArr.length; i++) {
        if (this.queArr[i].priority > queueElem.priority) {
            this.queArr.splice(i, 0, queueElem);
            contain = true;
            break;
        }
      }
      if (!contain) {
        this.queArr.push(queueElem);
      }
  }
  dequeue() {
      if (this.isEmpty()) return "Underflow";
      return this.queArr.shift();
  }
  front() {
      if (this.isEmpty()) return "No elements in Queue";
      return this.queArr[0];
  }
  rear() {
      if (this.isEmpty()) return "The Queue is Empty..!";
      return this.queArr[this.queArr.length - 1];
  }
  isEmpty() {
      return this.queArr.length == 0;
  }
  display() {
      let res_Str = "";
      for (let i = 0; i < this.queArr.length; i++)
      res_Str += this.queArr[i].element + " ";
      return res_Str;
  }
}
