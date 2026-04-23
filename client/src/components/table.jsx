import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Loader from '@/components/loader'

function AccountsList({ data, loading }) {

  return (
    <div>
        <Table>
          <TableHeader>
              <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Total Activities</TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                <TableRow>
                  <TableCell colSpan="4" className="text-center relative py-10">
                    <Loader />
                  </TableCell>
                </TableRow>
              ) : data && data.length > 0 ? (data.map((row)=>(
              <TableRow key={row.userId}>
                  <TableCell >{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>{row.total_logs}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="4" className="text-center">
                No results
              </TableCell>
            </TableRow>
          )}
          </TableBody>
          </Table>
    </div>

  )
}

export default AccountsList
