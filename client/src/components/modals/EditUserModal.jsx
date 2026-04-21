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
import { useState, useEffect } from 'react'
import { useForm} from 'react-hook-form';
import { EditUser } from "@/services/AdminServices"
import toast from 'react-hot-toast'

export function EditUserModal({ openEdit, setOpenEdit, fetchUsers, row }) {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const [loading, setLoading] = useState(false)
  const [id, setId]= useState()

  useEffect(()=>{
    if(row){
        reset(
            {
            name: row.name,
            email: row.email
            }
        )
        setId(row.userId)
    }
  }, [row, reset])

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const response = await EditUser(data, id)
      console.log(response.data.message)      
      if(response.status === 200){
        toast.success(`${response.data.message}`,{
          duration: 4000,
          position: 'top-right',
        });
        
        reset()
        setOpenEdit(false)
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
    <Dialog  open={openEdit} onOpenChange={setOpenEdit}>
       
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit a user</DialogTitle>
            <DialogDescription>
              Make sure to fill all fields
            </DialogDescription>
          </DialogHeader>
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
