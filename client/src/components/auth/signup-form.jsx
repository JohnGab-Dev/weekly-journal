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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from 'react-hook-form';
import {useState} from 'react'
import toast from 'react-hot-toast'
import { signup } from "@/services/AuthService"
export function SignupForm({
  ...props
}) {

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()
  const [loading, setLoading] = useState(false)
  const password = watch("password")
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const response = await signup(data)
      
      if(response.status === 200){
        toast.success(`${response.data.message}`,{
          duration: 4000,
          position: 'top-right',
        });
        
        reset()
        navigate('/login')
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
    <Card {...props}>
      <CardHeader>
        <CardTitle className='text-lg'>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                <FieldLabel htmlFor="role">
                  Sign up as
                </FieldLabel>
                <Controller
                  name="role"
                  control={control}
                  rules={{ required: "Please select a role" }}
                  render={({ field }) => (
                    <>
                      <Select onValueChange={field.onChange} value={field.value}  className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select User Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="employee">Employee</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {errors.role && (
                        <p className="text-sm text-red-500">{errors.role.message}</p>
                      )}
                    </>
                  )}
                />
              </Field>
            <FieldGroup>
              <Field>
                <Button type="submit" disabled={loading}>{loading == true ? 'Creating...' : 'Create account'}</Button>
                <Button variant="outline" type="button">
                  Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link to="/login" >Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
