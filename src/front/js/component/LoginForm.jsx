import React from "react";
import ReactDOM from 'react-dom';
import "../../styles/index.css";
const LoginForm = () => {
    return (
        <div className="d-flex flex-column flex-md-row min-vh-100">
            {/* Sección izquierda: Welcome Back */}
            <div className="bg-primary text-white d-flex flex-column align-items-center justify-content-center col-md-6 p-5">
                <h1 className="display-4 mb-4">Welcome Back!</h1>
                <p className="lead mb-5">To keep connected, please login with your account.</p>
                {/* Botón de iniciar sesión */}
                <button className="btn btn-light text-primary rounded-pill px-5 py-2 shadow-sm">
                    SIGN IN
                </button>
            </div>

            {/* Sección derecha: Create Account */}
            <div className="bg-white d-flex flex-column align-items-center justify-content-center col-md-6 p-5">
                <h1 className="display-5 text-primary mb-4">Create Account</h1>
                <p className="text-muted mb-5">or use your email for registration</p>
                {/* Formulario de registro */}
                <form className="w-100" style={{ maxWidth: '400px' }}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label visually-hidden">Name</label>
                        <input
                            type="text"
                            id="name"
                            className="form-control"
                            placeholder="Name"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label visually-hidden">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="Email"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label visually-hidden">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="Password"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2 rounded-pill">
                        SIGN UP
                    </button>
                </form>
                {/* Íconos Sociales */}
                <div className="d-flex justify-content-center mt-5">
                    <button className="btn btn-light me-2">
                        <i className="fab fa-twitter text-primary"></i>
                    </button>
                    <button className="btn btn-light me-2">
                        <i className="fab fa-facebook text-primary"></i>
                    </button>
                    <button className="btn btn-light">
                        <i className="fab fa-linkedin text-primary"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;