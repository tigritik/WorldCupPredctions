import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="navbar">
            {/* Logo */}
            <div className="navbar__logo" onClick={() => navigate("/")}>
                Predict 2026 World Cup
            </div>

            {/* Hamburger button (mobile only) */}
            <div
                className={`navbar__hamburger ${menuOpen ? "open" : ""}`}
                onClick={() => setMenuOpen((prev) => !prev)}
            >
                <span></span>
                <span></span>
                <span></span>
            </div>

            {/* Links */}
            <div className={`navbar__links ${menuOpen ? "open" : ""}`}>
                <NavLink to="/" onClick={closeMenu}
                    className={({ isActive }) =>
                        isActive ? "navbar__link active" : "navbar__link"
                }>
                    Home
                </NavLink>

                <NavLink
                    to="/predict-groups"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                        isActive ? "navbar__link active" : "navbar__link"
                    }
                >
                    Predict Groups
                </NavLink>

                <NavLink
                    to="/predict-matches"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                        isActive ? "navbar__link active" : "navbar__link"
                    }
                >
                    Predict Matches
                </NavLink>

                <NavLink
                    to="/predict-bracket"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                        isActive ? "navbar__link active" : "navbar__link"
                    }
                >
                    Predict Bracket
                </NavLink>

                <NavLink
                    to="/leaderboard"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                        isActive ? "navbar__link active" : "navbar__link"
                    }
                >
                    Leaderboard
                </NavLink>
            </div>
        </nav>
    );
}
