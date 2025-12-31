import React from "react";

const Home = () => {
  return (
    <div
      className="text-center text-white d-flex align-items-center justify-content-center"
      style={{
        height: "95vh",
        backgroundImage: "url('https://images.unsplash.com/photo-1615914143778-1a1a6e50c5dd?q=80&w=1168&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "2rem",
          borderRadius: "10px",
        }}
      >
        <h1 className="display-4 fw-bold">Welcome to Task Manager</h1>
        <p className="lead">Manage your tasks efficiently and stay organized!</p>
      </div>
    </div>
  );
};

export default Home;



