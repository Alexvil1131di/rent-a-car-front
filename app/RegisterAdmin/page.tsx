"use client"
import { Form, Input, Button } from "@heroui/react";
import { useState } from "react";

interface errorInterface {
    name: string,
    password: string,
    [key: string]: string
}

const Login = () => {

    const [password, setPassword] = useState("");
    const [submitted, setSubmitted] = useState<any>(null);
    const [errors, setErrors] = useState<errorInterface | undefined>({ name: "", password: "" });

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
        const newErrors: errorInterface = { name: "", password: "" };

        // Password validation
        const passwordError = getPasswordError(data.password as string);

        if (passwordError) {
            newErrors.password = passwordError;
        }

        // Username validation
        if (data.name === "admin") {
            newErrors.name = "Nice try! Choose a different username";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);

            return;
        }

        if (data.terms !== "true") {
            setErrors((prev) => ({ ...prev, terms: "Please accept the terms", name: prev?.name || "", password: prev?.password || "" }));

            return;
        }

        // Clear errors and submit
        setErrors({ name: "", password: "" });
        setSubmitted(data);
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        errorHandle(e)
    }

    return (
        <Form
            className="w-full justify-center items-center space-y-4"
            validationErrors={errors}
            onReset={() => setSubmitted(null)}
            onSubmit={onSubmit}
        >
            <div className="flex flex-col gap-4 items-center max-w-md w-full">
                <h2 className="text-[24px] font-semibold">Registrar Usuarios</h2>
                <p>Ingresa la informacion solicitada para crear un usuario</p>
                <img src="https://cdn4.iconfinder.com/data/icons/airport-elements-1/64/CAR_HIRE-Hire-car-rent-travel-512.png" className="w-[150px] h-[150px] m-8 " alt="" />
                <div className="flex items-center gap-2">
                    <Input
                        isRequired
                        errorMessage={({ validationDetails }) => {
                            if (validationDetails.valueMissing) {
                                return "Please enter your first name";
                            }

                            return errors?.name;
                        }}
                        label="First Name"
                        labelPlacement="outside"
                        name="name"
                        placeholder="Enter your name"
                    />
                    <Input
                        isRequired
                        errorMessage={({ validationDetails }) => {
                            if (validationDetails.valueMissing) {
                                return "Please enter your last name";
                            }

                            return errors?.name;
                        }}
                        label="Last Name"
                        labelPlacement="outside"
                        name="lastName"
                        placeholder="Enter your last Name"
                    />
                </div>


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

            {submitted && (
                <div className="text-small text-default-500 mt-4">
                    Submitted data: <pre>{JSON.stringify(submitted, null, 2)}</pre>
                </div>
            )}
        </Form>
    );
}

export default Login