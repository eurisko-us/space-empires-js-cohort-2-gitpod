import { setTimeout } from "timers/promises";



for (let n of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    console.log(n)
    await setTimeout(5000)
}

console.log("Done")