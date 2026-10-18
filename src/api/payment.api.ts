import apiClient from "@/lib/apiClient";
import type { IQueryParams } from "@/types";

export function makePayment(outageReportId: string) {
    return apiClient("/payment/create", {
        method: "POST",
        body: { outageReportId }
    })
}


export function getPayments(params: IQueryParams = {}) {
    return apiClient("/payment", { query: params })
}




export function getPaymentDetails(id: string) {
    return apiClient(`/payment/${id}`)
}


//get all payment record for admin

export function getAllPaymentRecords(page: number = 1, limit: number = 10) {
    return apiClient(`/admin/payment-record?page=${page}&limit=${limit}`);
}



//download invoice

export function getDownloadInvoice(transId:string){
    return apiClient(`/invoice/${transId}/download`)
}