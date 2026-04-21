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
import { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Textarea } from "@/components/ui/textarea"
import { AddEvent } from "@/services/AdminServices"
import toast from 'react-hot-toast'

export function AddModal({ openAdd, setOpenAdd, fetchData }) {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const response = await AddEvent(data)
      console.log(response.data.message)      
      if(response.status === 200){
        toast.success(`${response.data.message}`,{
          duration: 4000,
          position: 'top-right',
        });
        
        reset()
        setOpenAdd(false)
        fetchData()
        setLoading(false)
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
    <Dialog  open={openAdd} onOpenChange={setOpenAdd}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add a new event</DialogTitle>
            <DialogDescription>
              Make sure to fill all fields
            </DialogDescription>
          </DialogHeader>
           <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="date">Date</FieldLabel>
              <Input id="date" type="date" placeholder="" 
              {...register("date", { required: "Date is required" })}
              />
              {errors.date && (
                    <p className="text-sm text-red-500">
                      {errors.date.message}
                    </p>
                  )}
            </Field>
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input id="title" type="text" placeholder="" 
              {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                    <p className="text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
            </Field>
            <Field>
              <FieldLabel htmlFor="desc">Description</FieldLabel>
              <Textarea placeholder="Type your message here." id="desc"
              {...register("desc", { required: "Description is required" })}
              />
              {errors.desc && (
                    <p className="text-sm text-red-500">
                      {errors.desc.message}
                    </p>
                  )}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Event"}</Button>
          </DialogFooter>
          </form>
        </DialogContent>
      
    </Dialog>
  )
}
