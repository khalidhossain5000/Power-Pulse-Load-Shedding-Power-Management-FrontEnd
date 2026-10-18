"use client";

import { useEffect } from "react";
import { useGetInvoiceDownload } from "@/hooks";
import { Download, FileText, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

type DownloadInvoiceButtonProps = {
  transId: string;
};

export default function DownloadInvoiceButton({
  transId,
}: DownloadInvoiceButtonProps) {
  const { refetch, isFetching: invoicePending } =
    useGetInvoiceDownload(transId);

  useEffect(() => {
    return () => {
      // Cleanup is handled after the download starts.
    };
  }, []);

  const handleDownload = async () => {
    if (!transId || invoicePending) return;

    try {
      const result = await refetch();

      if (result.error) {
        throw result.error;
      }

      const invoice = result.data;

      if (!(invoice instanceof Blob) || invoice.size === 0) {
        throw new Error("Invoice PDF is empty or invalid.");
      }

      const blobUrl = URL.createObjectURL(invoice);
      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = `invoice-${transId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Release the object URL after the browser starts downloading.
      window.setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 1000);

      toast.success("Invoice downloaded successfully.");
    } catch (error) {
      console.error("Invoice download failed:", error);
      toast.error("Failed to download invoice. Please try again.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={!transId || invoicePending}
      aria-label="Download invoice PDF"
      className=" cursor-pointer 
        group inline-flex min-h-9 items-center justify-center gap-2
        rounded-lg border border-primary/20
        bg-primary px-3 py-2
        text-xs font-semibold text-primary-foreground
        shadow-sm shadow-primary/10
        transition-all duration-200
        hover:-translate-y-0.5 hover:bg-primary/90
        hover:shadow-md hover:shadow-primary/20
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-primary focus-visible:ring-offset-2
        disabled:pointer-events-none disabled:opacity-60
        sm:min-h-10 sm:px-3.5 sm:text-sm
      "
    >
      {invoicePending ? (
        <LoaderCircle className="size-4 shrink-0 animate-spin" />
      ) : (
        <Download className="size-4 shrink-0 transition-transform group-hover:translate-y-0.5" />
      )}

      <span className="whitespace-nowrap">
        {invoicePending ? "Downloading..." : "Download Invoice"}
      </span>

      {!invoicePending && (
        <FileText className="hidden size-4 shrink-0 opacity-80 sm:block" />
      )}
    </button>
  );
}
