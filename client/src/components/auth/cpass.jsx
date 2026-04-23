import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {useState} from 'react'
import { changePass } from '@/services/AuthService'
import toast from 'react-hot-toast'


export function ChangePass({
  className,
  ...props
}) {

    const { register, handleSubmit,watch, reset, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false)
    const password = watch("password")
    const navigate = useNavigate(); 

    const userId = localStorage.getItem("userId")
    if(!userId){
      navigate('/login')
    }
    const onSubmit = async (data) => {
      try {
        setLoading(true)
        
        const response = await changePass(userId,data);
        
        if(response.status === 200){
          toast.success(`${response.data.message}`,{
            duration: 4000,
            position: 'top-right',
          });
          reset()
          localStorage.removeItem('userId')
          navigate('/login')
        }

      } catch (error) {
        if (error.response) {
          toast.error(`${error.response.data.message}`,{
            duration: 4000,
            position: 'top-right',
          });
          console.error("Server Error:", error.response.data.message)
        } else {
          console.error("Request error:", error.message)
        }
      }finally{
        setLoading(false)
      }
    }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className=" px-4 justify-center">
        <CardHeader className="mb-6">
          <CardTitle className='text-xl'>Set up new password</CardTitle>
          <CardDescription>
            Enter your new password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
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
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
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
              <Field>
                <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
