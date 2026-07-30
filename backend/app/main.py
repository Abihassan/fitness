from fastapi import FastAPI

app = FastAPI(title="Gym App API")

@app.get("/")
def root():
    return {"message": "Gym App API is running"}
