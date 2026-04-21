import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState, useEffect} from 'react'
import { useForm } from 'react-hook-form';
import { AddUser } from "@/services/AdminServices"
import toast from 'react-hot-toast'
import { changePass } from "@/services/AdminServices"

export function ChangePass({ openCpass, setOpenCpass, row}) {

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()
  const [loading, setLoading] = useState(false)
  const password = watch("password")
  const [id, setId] = useState()

  useEffect(()=>{
    if(row){
      setId(row.userId)
    }
  }, [row])

  const onSubmit = async (data) => {
    let id = row.userId
    try {
      setLoading(true)
      const response = await changePass(data, id)
      console.log(response.data.message)      
      if(response.status === 200){
        toast.success(`${response.data.message}`,{
          duration: 4000,
          position: 'top-right',
        });
        
        reset()
        setOpenCpass(false)
        fetchUsers()
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
    <Dialog  open={openCpass} onOpenChange={setOpenCpass}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Change a user password</DialogTitle>
            <DialogDescription>
              Make sure to fill all fields
            </DialogDescription>
          </DialogHeader>
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
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
          </DialogFooter>
          </form>
        </DialogContent>
      
    </Dialog>
  )
}
