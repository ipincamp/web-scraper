import express, { Application, NextFunction, Request, Response } from "express";

const app: Application = express();
const port: Number = 5000;

app.use("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      __code: 200,
      status: true,
      result: "OK",
    });
  } catch (error) {
    next(error);
  }
});

app.listen(port, () => console.info("http://localhost:5000/"));
