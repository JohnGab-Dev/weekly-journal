import React from 'react'
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm} from 'react-hook-form';
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import toast from 'react-hot-toast'
import { ChangePassword } from '@/services/AdminServices'

function ChangePass() {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm()
    const [loading, setLoading] = useState(false)
    const password = watch("password")
    
    const onSubmit = async (data) => {
        try {
        setLoading(true)
        const response = await ChangePassword(data)     
        if(response.status === 200){
            toast.success(`${response.data.message}`,{
            duration: 4000,
            position: 'top-right',
            });
            reset()
        }

        } catch (error) {
        if (error.response) {
            toast.error(`${error.response.data.message}`,{
            duration: 4000,
            position: 'top-right',
            });
            console.error("Server Error:", error.response.data.message)
        } else if (error.request) {
            console.error("No response from server")
        } else {
            console.error("Request error:", error.message)
        }
        }finally{
        setLoading(false)
        }
    }
  return (
    <div className="w-full bg-white shadow-sm p-6 rounded-lg" >
        <h1 className='sm:text-xl mb-4 font-medium'>Change password</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='w-full sm:max-w-xl'>
            <FieldGroup>

                <Field>
                    <FieldLabel htmlFor="password">Old Password</FieldLabel>
                    <Input id="opass" type="password" 
                        {...register("opass", {
                                required: "Old Password is required"})}
                    />
                    {errors.opass && (
                            <p className="text-sm text-red-500">
                            {errors.opass.message}
                            </p>
                        )}
                </Field>

                <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" 
                    {...register("password", {
                            required: "Password is required",
                            minLength: {
                            value: 8,
                            message: "Must be at least 8 characters",
                            },
                        })}
                />
                {errors.password && (
                        <p className="text-sm text-red-500">
                        {errors.password.message}
                        </p>
                    )}
                </Field>
                <Field>
                    <FieldLabel htmlFor="confirm-password">
                    Confirm Password
                    </FieldLabel>
                    <Input id="confirm-password" type="password" 
                    {...register("confirmPassword", {
                        required: "Confirm your password",
                        validate: (value) =>
                            value === password || "Passwords do not match",
                        })}
                    />
                    {errors.confirmPassword && (
                        <p className="text-sm text-red-500">
                        {errors.confirmPassword.message}
                        </p>
                    )}
                </Field>
                
            </FieldGroup>
            <Button type="submit" className="mt-5" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
        </form>
    </div>
  )
}

export default ChangePass
