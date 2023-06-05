import { ChangeEvent, useEffect, useState } from "react";
import { useAuth } from "../../hooks/auth";

export default function Login() {
  const { login } = useAuth();

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => setLoading(false), []);
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({ email: formValues.email, password: formValues.password });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const input_style = "form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none";

  return (
    <form onSubmit={handleLogin}>
      <div className="mb-6">
        <input autoComplete="email" required type="email" name="email" value={formValues.email} onChange={handleChange} placeholder="Correo Electronico" className={`${input_style}`} />
      </div>
      <div className="mb-6">
        <input autoComplete="current-password" required type="password" name="password" value={formValues.password} onChange={handleChange} placeholder="Contraseña" className={`${input_style}`} />
      </div>
      <button type="submit" style={{ backgroundColor: `${loading ? "#ccc" : "#3446eb"}` }} className="inline-block px-7 py-4 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full" disabled={loading}>
        {loading ? "cargando..." : "Ingresar"}
      </button>
    </form>
  );
}
