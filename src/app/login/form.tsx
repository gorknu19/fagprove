"use client";
import { signIn } from "next-auth/react";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  let [loading, setLoading] = useState(false);
  let [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setFormValues({ email: "", password: "" });

      const res = await signIn("credentials", {
        redirect: false,
        email: formValues.email,
        password: formValues.password,
      });

      setLoading(false);

      console.log(res);
      if (!res?.error) {
        router.push("/");
      } else {
        setError("invalid email or password");
      }
    } catch (error: any) {
      setLoading(false);
      setError(error);
    }
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <form onSubmit={onSubmit} className="text-center flex flex-col ">
      {error && (
        <p className="text-center bg-red-300 py-4 mb-6 rounded">{error}</p>
      )}
      <label htmlFor="email">Email:</label>
      <input
        required
        id="email"
        type="email"
        name="email"
        value={formValues.email}
        onChange={handleChange}
        className="bg-slate-700 border border-black rounded-md p-2 mb-5"
      />
      <label htmlFor="password">Password:</label>
      <input
        required
        id="password"
        type="password"
        name="password"
        value={formValues.password}
        onChange={handleChange}
        className="bg-slate-700 border border-black rounded-md p-2 mb-5"
      />
      <button
        style={{
          backgroundColor: `${
            loading ? "#ccc" : "rgb(55 65 81 / var(--tw-bg-opacity))"
          }`,
          cursor: "pointer",
        }}
        disabled={loading}
        className={` text-gray-300 bg-gray-700 hover:bg-gray-800 hover:text-white rounded-md p-2 text-sm font-medium`}
      >
        {loading ? "loading..." : "Login"}
      </button>
    </form>
  );
};
