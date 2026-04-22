import { Button } from "@/components/ui/button"
import {
  Field,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form';
import {useEffect, useState} from 'react'
import { exportReport } from "@/services/StudentServices"
import api from "@/axiosInstance/api";

function ExportReport({ user }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()
    const [loading, setLoading] = useState(false)
    
    const [data, setData] = useState();
    const userId = user.userId;

    const fetchPreference = async () => {
        let url = "";
        if(user.role === "employee"){
            url = `get-employee-preference?id=${userId}`;
        }else{
            url = `get-preference?id=${userId}`;
        }
        
        try{
            const res = await api.get(url)
            console.log(res.data.data)
            setData(res.data.data)
        }catch(error){  
            console.error(error)
        }
    }

    useEffect(() => {
        fetchPreference();
    }, []);

    useEffect(() => {
        if (data) {
            reset({
                name: data.owner_name,
                department: data.department,
                designation: data.designation,
                coordinator: data.coordinator || "",
                head_name: data.head_name,
                head_designation: data.head_designation,
                hours: data.hours || ""
            });
        }
    }, [data, reset]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            const response = await exportReport(data, user.role);

            // 🔥 Get filename from Laravel header
            const contentDisposition = response.headers['content-disposition'];

            let fileName = 'reports.docx'; // fallback

            if (contentDisposition) {
                const match = contentDisposition.match(/filename="?(.+)"?/);
                if (match?.[1]) {
                    fileName = match[1];
                }
            }

            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            });

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
  return (
    <div className="bg-white rounded-xl">
        <div className="p-6 border-b">   
            <h1 className="sm:text-xl font-semibold">Export your report</h1>
            <h2 className="text-xs sm:text-sm text-gray-700">Please fill in all fields to complete the export</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-6">
            <div className='w-full sm:w-2xl flex flex-col gap-4'>
                <div className="w-full flex flex-col md:flex-row items-center gap-4">
                    <Field>
                        <FieldLabel htmlFor="name">Your Name</FieldLabel>
                        <Input id="name" type="text" {...register("name", {required: "Name field is required"})}
                        />
                        {errors.name && (
                                <p className="text-sm text-red-500">
                                    {errors.name.message}
                                </p>
                            )}
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="department">Department/Institution</FieldLabel>
                        <Input id="department" type="text" {...register("department", {required: "Department field is required"})}
                        />
                        {errors.department && (
                                <p className="text-sm text-red-500">
                                    {errors.department.message}
                                </p>
                            )}
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="designation">Designation/Job description</FieldLabel>
                        <Input id="designation" type="text" {...register("designation", {required: "Designation field is required"})}
                        />
                        {errors.designation && (
                                <p className="text-sm text-red-500">
                                    {errors.designation.message}
                                </p>
                            )}
                    </Field>
                </div>
                
                {user.role === "student" && (
                    <Field>
                        <FieldLabel htmlFor="coordinator">Coordinator</FieldLabel>
                        <Input id="coordinator" type="text" {...register("coordinator", {required: "Coordinator field is required"})}
                        />
                        {errors.coordinator && (
                                <p className="text-sm text-red-500">
                                    {errors.coordinator.message}
                                </p>
                            )}
                    </Field>
                )}
                
                
                <div className="w-full flex flex-col md:flex-row items-center gap-4">
                    <Field>
                        <FieldLabel htmlFor="head_name">Head/Supervisor Name</FieldLabel>
                        <Input id="head_name" type="text" {...register("head_name", {required: "Head name field is required"})}
                        />
                        {errors.head_name && (
                                <p className="text-sm text-red-500">
                                    {errors.head_name.message}
                                </p>
                            )}
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="head_designation">Head/Supervisor Designation</FieldLabel>
                        <Input id="head_designation" type="text" {...register("head_designation", {required: "Head designation field is required"})}
                        />
                        {errors.head_designation && (
                                <p className="text-sm text-red-500">
                                    {errors.head_designation.message}
                                </p>
                            )}
                    </Field>
                </div>

                {user.role === "student" && (
                    <Field>
                        <FieldLabel htmlFor="hours">Hours worked</FieldLabel>
                        <Input id="hours" type="number" {...register("hours", {required: "Hours field is required"})}
                        />
                        {errors.hours && (
                                <p className="text-sm text-red-500">
                                    {errors.hours.message}
                                </p>
                            )}
                    </Field> 
                )}
                
                
                <div className="w-full flex flex-col md:flex-row items-center gap-4">
                    
                    <Field>
                        <FieldLabel htmlFor="startDate">Start Date</FieldLabel>
                        <Input id="startDate" type="date" 
                        {...register("startDate", { required: "Start date is required" })}
                        />
                        {errors.startDate && (
                                <p className="text-sm text-red-500">
                                {errors.startDate.message}
                                </p>
                            )}
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="date">End Date</FieldLabel>
                        <Input id="endDate" type="date" 
                        {...register("endDate", { required: "End date is required" })}
                        />
                        {errors.endDate && (
                                <p className="text-sm text-red-500">
                                {errors.endDate.message}
                                </p>
                            )}
                    </Field>
                </div>
                
            </div>
        
            <div className="max-w-[15rem] mt-4 ml-auto">
                <Field>
                    <Button type="submit" disabled={loading}>{loading == true ? 'Exporting...' : 'Export and Save Preferences'}</Button>
                </Field>       
            </div>
        </form>
    </div>
    
  )
}

export default ExportReport
