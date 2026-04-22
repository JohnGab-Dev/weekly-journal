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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {useState} from 'react'
import { login } from '@/services/AuthService'
import toast from 'react-hot-toast'


export function VerifyOtp({
  className,
  ...props
}) {

    const { control, handleSubmit, reset, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate(); 
    const onSubmit = async (data) => {
      
      try {
        setLoading(true)
        console.log(data)
        // const response = await login(data);
        
        // if(response.status === 200){
        //   toast.success(`${response.data.message}`,{
        //     duration: 4000,
        //     position: 'top-right',
        //   });
        //   reset()
          
        //   if(response.data.data){
        //     localStorage.setItem("token", response.data.token)
        //     response.data.url && navigate(response.data.url);
        //   }
          
        

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
      <Card className=" px-4 justify-center py-10">
        <CardHeader className="mb-6">
          <CardTitle className='text-xl'>Verify One Time Password</CardTitle>
          <CardDescription>
            Enter the OTP we've sent to your email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="w-full flex flex-col items-center gap-4">
                <Controller
                    name="otp"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: "OTP is required",
                        pattern: {
                            value: /^[0-9]+$/,
                            message: "Only numbers allowed"
                        },
                        minLength: {
                            value: 6,
                            message: "OTP must be 6 digits"
                        }
                    }}
                    render={({ field, fieldState }) => (
                        <div className="flex flex-col items-center gap-2">
                            <InputOTP
                                maxLength={6}
                                value={field.value}
                                onChange={(value) => {
                                    field.onChange(value);
                                    if (value.length === 6) {
                                        handleSubmit(onSubmit)();
                                    }
                                }}
                            >
                                <InputOTPGroup className="gap-2">
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>

                            {fieldState.error && (
                                <p className="text-red-500 text-sm text-center">
                                    {fieldState.error.message}
                                </p>
                            )}
                        </div>
                    )}
                />

                <Field>
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? 'Verifying...' : 'Submit'}
                    </Button>
                </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
