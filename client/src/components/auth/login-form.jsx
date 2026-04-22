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
import { login } from '@/services/AuthService'
import toast from 'react-hot-toast'


export function LoginForm({
  className,
  ...props
}) {

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate(); 
    const onSubmit = async (data) => {
      
      try {
        setLoading(true)
        const response = await login(data);
        
        if(response.status === 200){
          toast.success(`${response.data.message}`,{
            duration: 4000,
            position: 'top-right',
          });
          reset()
          
          if(response.data.data){
            localStorage.setItem("user", JSON.stringify(response.data.data));
            localStorage.setItem("isAuthenticated", true);
            localStorage.setItem("token", response.data.token)
          }
          response.data.url && navigate(response.data.url);
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className=" px-4 justify-center">
        <CardHeader className="mb-6">
          <CardTitle className='text-xl'>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="text" 
                  {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                    message: "Email is not valid"
                  }
                })}
                />
                {errors.email && <p className="text-red-600 text-xs">{errors.email.message}</p>}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link className="ml-auto inline-block text-sm underline-offset-4 hover:underline" to="/email-verify">Forgot your password?</Link>
                </div>
                <Input id="password" type="password" 
                  {...register("password", {
                  required: "Password is required",
                  })}
                />
                {errors.password && (<p className="text-red-600 text-xs">{errors.password.message}</p>)}
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
                <Button variant="outline" type="button">
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link to="/signup">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
