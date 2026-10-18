"use client";

import { useGetInvoiceDownload } from "@/hooks";

type DownloadInvoiceButtonProps = {
    transId: string;
};

export default function DownloadInvoiceButton({
    transId,
}: DownloadInvoiceButtonProps) {
    const {data,isPending} = useGetInvoiceDownload(transId)
    console.log(data,"From invoice download btn here")
    return (
        <button
            type="button"
            onClick={() => {
                // Invoice download logic will go here
            }}
        >
            Download Invoice
        </button>
    );
}