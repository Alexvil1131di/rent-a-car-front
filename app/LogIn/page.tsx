"use client"
import { Form, Input, Button } from "@heroui/react";
import { use, useState } from "react";
import { useLogin } from "./loginHooks/hook";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface errorInterface {
    email: string,
    password: string,
    [key: string]: string
}

const LogIn = () => {

    const [password, setPassword] = useState("");
    const [submitted, setSubmitted] = useState<any>(null);
    const [errors, setErrors] = useState<errorInterface | undefined>({ email: "", password: "" });

    const { mutateAsync: logIn } = useLogin();
    const router = useRouter();
    // Real-time password validation
    const getPasswordError = (value: string) => {
        if (value.length < 6) {
            return "Password must be 6 characters or more";
        }
        if ((value.match(/[A-Z]/g) || []).length < 1) {
            return "Password needs at least 1 uppercase letter";
        }
        if ((value.match(/[^a-z]/gi) || []).length < 1) {
            return "Password needs at least 1 symbol";
        }

        return null;
    };

    const errorHandle = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));

        // Custom validation checks
        const newErrors: errorInterface = { email: "", password: "" };

        // Password validation
        const passwordError = getPasswordError(data.password as string);

        if (passwordError) {
            newErrors.password = passwordError;
        }

        // Username validation
        if ((data.email as string).includes("admin")) {
            newErrors.email = "Nice try! Choose a different username";
        }

        if (newErrors.email || newErrors.password) {
            setErrors(newErrors);

            return true;
        }

        // Clear errors and submit
        setErrors({ email: "", password: "" });
        setSubmitted(data);

        return false
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const error = errorHandle(e);
        console.log(error)

        if (error) return;
        const data = Object.fromEntries(new FormData(e.currentTarget));
        logIn({ email: String(data.email), password });
        toast.promise(logIn({ email: String(data.email), password }), {
            pending: "Loading...",
            success: "Logged in successfully",
            error: "Error logging in",
        }).then(() => {
            window.location.href = "/Clients";
        })


    }

    return (
        <Form
            className="w-full h-full justify-center items-center space-y-4"
            validationErrors={errors}
            onReset={() => setSubmitted(null)}
            onSubmit={onSubmit}
        >
            <div className="flex flex-col gap-4 items-center max-w-md w-full">
                <h2 className="text-[24px] font-semibold">Iniciar Sesion</h2>
                <p>Ingrese su correo electronico y contraseña</p>
                <img src="https://cdn4.iconfinder.com/data/icons/airport-elements-1/64/CAR_HIRE-Hire-car-rent-travel-512.png" className="w-[150px] h-[150px] m-8 " alt="" />


                <Input
                    isRequired
                    errorMessage={({ validationDetails }) => {
                        if (validationDetails.valueMissing) {
                            return "Please enter your email";
                        }
                        if (validationDetails.typeMismatch) {
                            return "Please enter a valid email address";
                        }
                    }}
                    label="Email"
                    labelPlacement="outside"
                    name="email"
                    placeholder="Enter your email"
                    type="email"
                />

                <Input
                    isRequired
                    errorMessage={getPasswordError(password)}
                    isInvalid={getPasswordError(password) !== null}
                    label="Password"
                    labelPlacement="outside"
                    name="password"
                    placeholder="Enter your password"
                    type="password"
                    value={password}
                    onValueChange={setPassword}
                />


                {errors?.terms && <span className="text-danger text-small">{errors?.terms}</span>}

                <div className="flex gap-4 w-full">
                    <Button className="w-full" color="primary" type="submit">
                        Submit
                    </Button>
                    <Button type="reset" variant="bordered">
                        Reset
                    </Button>
                </div>
            </div>

        </Form>
    );
}

export default LogIn