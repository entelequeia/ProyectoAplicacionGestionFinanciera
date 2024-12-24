import React from "react";
import { CiUser } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import { TbPasswordFingerprint } from "react-icons/tb";
import { FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa";
import "../../styles/LoginForm.css";

export function LoginForm() {
    return (
        <div className="d-flex justify-content-center align-items-center mt-5 bg-white p-3">
            <div className="d-flex flex-md-row bg-white rounded shadow-lg overflow-hidden custom-container">
                {/* Sección izquierda: Welcome Back */}
                <div className="bg-lightviolet bg-gradient text-white d-flex flex-column align-items-center justify-content-center col-lg-6 col-md-6 col-sm-12 p-5 position-relative z-index-2 custom1-container">
                    <h1 className="display-4 mb-4 fw-bolder">Welcome Back!</h1>
                    <p className="lead mb-5">
                        To keep connected, please login with your account.
                    </p>
                    {/* Botón de iniciar sesión */}
                    <button className="btn btn-outline-light text-white rounded-pill px-5 py-2 shadow-sm btn-signin">
                        SIGN UP
                    </button>
                </div>

                {/* Sección derecha: Create Account */}
                <div className="bg-violet text-center text-white d-flex flex-column align-items-center justify-content-center col-lg-6 col-md-6 col-sm-12 p-5 position-relative z-index-2 custom2-container">
                    <h1 className="display-5 text-violet2 mb-4">Create Account</h1>
                    <p className="text-muted mb-5">or use your email for registration</p>

                    {/* Formulario de registro */}
                    <form className="w-100" style={{ maxWidth: '400px' }}>
                        <div className="mb-3 input-container">
                            <CiUser className="icon" />
                            <input
                                type="text"
                                id="name"
                                className="form-control"
                                placeholder="Name"
                            />
                        </div>
                        <div className="mb-3 input-container">
                            <MdOutlineEmail className="icon" />
                            <input
                                type="email"
                                id="email"
                                className="form-control"
                                placeholder="Email"
                            />
                        </div>
                        <div className="mb-3 input-container">
                            <TbPasswordFingerprint className="icon" />
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                placeholder="Password"
                            />
                        </div>
                        <button type="submit" id="btnSingup" className="btn btn-violet bg-gradient w-100 py-2 rounded-pill">
                            SIGN IN
                        </button>
                    </form>

                    {/* Íconos Sociales */}
                    <div className="d-flex justify-content-center mt-5">
                        <button className="btn btn-light rounded-circle">
                            <FaTwitter />
                        </button>
                        <button className="btn btn-light rounded-circle me-2 ms-2">
                            <FaFacebook />
                        </button>
                        <button className="btn btn-light rounded-circle">
                            <FaLinkedin />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
