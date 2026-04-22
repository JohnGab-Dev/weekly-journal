import React from 'react'
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm} from 'react-hook-form';
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { UpdateProfile } from '@/services/AdminServices'
import toast from 'react-hot-toast'

function EditProfile() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()
    const [loading, setLoading] = useState(false)

    const [user, setUser] = useState(() => 
        JSON.parse(localStorage.getItem("user")) || {}
    );

    useEffect(() => {
        if (user) {
            reset(user);
        }
    }, [user, reset]);

    const onSubmit = async (data) => {
        try {
        setLoading(true)
        const response = await UpdateProfile(data)
        
        if(response.status === 200){
            toast.success(`${response.data.message}`,{
            duration: 4000,
            position: 'top-right',
            });
            
            const updatedUser = {
                ...user,
                name: data.name,
                email: data.email
            };

            // update state (this triggers re-render)
            setUser(updatedUser);

            // update localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser));
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
        <h1 className='sm:text-xl mb-4 font-medium'>Update profile information</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='w-full sm:max-w-xl'>
            <FieldGroup>
                <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input id="name" type="text" placeholder="John Doe"  
                {...register("name", { required: "Fullname is required" })}
                />
                {errors.name && (
                        <p className="text-sm text-red-500">
                        {errors.name.message}
                        </p>
                    )}
                </Field>
                <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="text" placeholder="m@example.com" 
                {...register("email", {
                        required: "Email is required",
                        pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email format",
                        },
                    })}
                />
                {errors.email && (
                        <p className="text-sm text-red-500">
                        {errors.email.message}
                        </p>
                    )}
                </Field>
            </FieldGroup>
            <Button type="submit" className="mt-5" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
        </form>
    </div>
  )
}

export default EditProfile
