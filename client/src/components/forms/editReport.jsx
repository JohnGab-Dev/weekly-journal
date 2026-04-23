import { Button } from "@/components/ui/button"
import {
  Field,
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
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Plus, X } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {useEffect, useState} from 'react'
import toast from 'react-hot-toast'
import { editReport, delReport } from "@/services/ReportServices"
import api from "@/axiosInstance/api"

function EditReport({ date, user }) {
    const [Report, setReport] = useState()
    
    const fetchReport = async () => {
        try {
            const res = await api.get(`/fetch-report?date=${date}`)
            const report = res.data.report
            if (!report) return
            setReport(report)

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        fetchReport()
    }, [date])

    
    const {
            register,
            control,
            handleSubmit,
            reset,
            formState: { errors },
        } = useForm({
        defaultValues: {
            items: []
        }
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    });

     useEffect(() => {
        if (Report) {
            reset({
                date: Report[0].date,
                doc_desc: Report[0].doc_desc,
                items: Report.map(item => ({
                    reportId: item.reportId,
                    type: item.type,
                    desc: item.desc
                }))
            })
        }
    }, [Report, reset])


    const onSubmit = async (data) => {
        try {
        setLoading(true)
        const formData = new FormData()
        formData.append("date", data.date)
        // file input (IMPORTANT)
        if (data.image && data.image[0]) {
            formData.append("image", data.image[0])
        }
        formData.append("doc_desc", data.doc_desc ?? "")

        // nested items array
        data.items.forEach((item, index) => {
            formData.append(`items[${index}][id]`, item.reportId ?? "")
            formData.append(`items[${index}][type]`, item.type)
            formData.append(`items[${index}][desc]`, item.desc)
        })
        const response = await editReport(Report[0].reportDateId, formData)
        
        if(response.status === 200){
            toast.success(`${response.data.message}`,{
            duration: 4000,
            position: 'top-right',
            });
            
            reset()
            navigate('/home')
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

    const handleDelete = async (e, id) => {
        e.preventDefault()
        try{
        const response = await delReport(id)
        
        if(response.status === 200){
            toast.success(`${response.data.message}`,{
            duration: 4000,
            position: 'top-right',
            });
           
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
    <div className="bg-white rounded-xl">
        <div className="p-6 border-b">   
            <h1 className="sm:text-xl font-semibold">Edit a Report</h1>
            <h2 className="text-xs sm:text-sm text-gray-700">Edit your existing report here.</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-6">
            <div className='w-full sm:w-2xl flex flex-col gap-4'>
                <Field>
                    <FieldLabel htmlFor="date">Date</FieldLabel>
                    <Input id="date" type="date" disabled 
                    {...register("date")} />
                </Field>
                {user.role === "student" && (
                    <>
                        <Field>
                            <FieldLabel htmlFor="image" className=''>Documentation(Choose a file to update your current image)</FieldLabel>
                            <Input id="image" type="file" {...register("image")}
                                />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="doc_desc">Documentation Description</FieldLabel>
                            <Textarea placeholder="Type the description here." id={"doc_desc"}
                            {...register("doc_desc")}
                            />
                        </Field>
                    </>
                )}
                
            </div>
            <div className="">
                <h1>Report fields</h1>
            </div>
            {fields.map((item, index) => (
                <div className='w-full sm:w-2xl flex flex-col p-4 bg-gray-50 rounded-lg' key={item.id}>
                    <div className="w-full flex flex-col-reverse sm:flex-row gap-4">
                        <Field className="sm:w-[75%]">
                            <FieldLabel htmlFor={`items.${index}.desc`}>Description</FieldLabel>
                            <Textarea placeholder="Type the description here." id={`items.${index}.desc`}
                                {...register(`items.${index}.desc`, { required: "Description is required" })}
                                />
                                {errors.items?.[index]?.desc && (
                                    <p className="text-sm text-red-500">
                                        {errors.items[index].desc.message}
                                    </p>
                                )}
                        </Field>
                        <Field className="sm:w-[25%]">
                            <FieldLabel htmlFor={`items.${index}.type`}>
                            Type
                            </FieldLabel>
                            <Controller
                            name={`items.${index}.type`}
                            control={control}
                            rules={{ required: "Please select a report type." }}
                            render={({ field }) => (
                                <>
                                <Select onValueChange={field.onChange} value={field.value}  className="w-full">
                                    <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="objective">Objective</SelectItem>
                                            <SelectItem value="reflection">Reflection</SelectItem>
                                            <SelectItem value="task_accomplished">Task Accomplished</SelectItem>
                                            <SelectItem value="knowledge">Knowledge</SelectItem>
                                            <SelectItem value="skills">Skills</SelectItem>
                                            <SelectItem value="values">Values</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.items?.[index]?.type && (
                                    <p className="text-sm text-red-500">
                                        {errors.items[index].type.message}
                                    </p>
                                )}
                                </>
                            )}
                            />
                        </Field>
                        
                        <div className="flex justify-end items-start ">
                            <button type="button" className="text-sm flex items-center gap-1 text-gray-700 font-medium cursor-pointer hover:bg-slate-200 rounded-full p-[5px]" onClick={(e) => {handleDelete(e, item.reportId); remove(index)}}>
                                <X size={15}/>
                            </button>
                        </div>
                        
                    </div>
                </div>
            ))}
            
            <div className="w-full flex justify-end">
                <button type="button" onClick={() => {append({ type: "", desc: "" }); }} className="text-sm flex items-center gap-1 hover:underline text-blue-600 font-medium cursor-pointer"><Plus size={10} /> Add another </button>
            </div>
            <div className="max-w-[7rem]">
                <Field>
                    <Button type="submit" disabled={loading}>{loading == true ? 'Saving...' : 'Save Changes'}</Button>
                </Field>       
            </div>
        </form>
    </div>
    
  )
}

export default EditReport
