import { getAllPaymentRecords, getDownloadInvoice, getPaymentDetails, getPayments, makePayment } from "@/api";
import type { IQueryParams } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useMakePayment() {
    return useMutation({
        mutationFn: makePayment
    })
}

export function useGetPayments(params: IQueryParams = {}) {
    return useQuery({
        queryKey: ["payments", params],
        queryFn: () => getPayments(params)
    })
}

export function useGetPaymentDetails() {
    return useQuery({
        queryKey: ["payment-details"],
        queryFn: () => getPaymentDetails
    })
}



export function useGetPaymentRecords(page: number = 1, limit: number = 10) {
    return useQuery({
        queryKey: ["payment-record", page, limit],
        queryFn: () => getAllPaymentRecords(page, limit),
    });
}


export function useGetInvoiceDownload(transId:string){
      return useQuery({
        queryKey: ["invoice"],
        queryFn: () => getDownloadInvoice(transId),
    });
}