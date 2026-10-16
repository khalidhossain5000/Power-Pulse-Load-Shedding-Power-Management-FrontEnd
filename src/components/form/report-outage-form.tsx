"use client";

import {
  FiAlertTriangle,
  FiChevronDown,
  FiFileText,
  FiGrid,
} from "react-icons/fi";

import { useGetArea, useReportOutage } from "@/hooks";

import { useForm } from "@tanstack/react-form";

import { Field, FieldError, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";

import { reportOutageSchema } from "@/validation";

import { toast } from "sonner";

const ReportOutageForm = () => {
  const { data, isPending: areaPending ,isError} = useGetArea();
console.log(data,isError,"are report outage id here error are")
  const { mutate: reportOutage, isPending: reportOutagePending } =
    useReportOutage();

  const areas = data?.data ?? [];

  const form = useForm({
    defaultValues: {
      cause: "Equipment Failure",
      description:
        "Unexpected power outage caused by a fault in the local distribution equipment.",
      areaId: "",
    },

    validators: {
      onSubmit: reportOutageSchema,
    },

    onSubmit: async ({ value }) => {


      const outageData = {
        cause: value.cause,
        description: value.description,
        areaId: value.areaId,
      };

      reportOutage(outageData, {
        onSuccess: (res) => {


          form.reset();

          toast.success(
            res.message || "Outage Reported Successfully",
          );
        },

        onError: (err) => {
          const message =
            (err as any)?.data?.message ||
            err.message ||
            "Failed when reporting outage";

          console.log(err, "this is report outage error");

          toast.error(
            message || "Something went wrong when reporting outage",
          );
        },
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="mx-auto w-full max-w-3xl"
    >
      {/* Main Card */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Decorative gradient glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-gradient-to-br from-primary/25 via-primary/10 to-transparent blur-3xl" />

        {/* Header */}
        <div className="relative border-b border-border px-6 py-6 sm:px-8">
          <h2 className="font-manrope text-xl font-bold tracking-tight text-card-foreground">
            Report Power Outage
          </h2>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Report an unexpected power outage in your area.
          </p>
        </div>

        {/* Form Body */}
        <div className="relative p-6 sm:p-8">
          <FieldGroup>
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Cause */}
              <form.Field name="cause">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <Label
                        htmlFor={field.name}
                        className="mb-2 block text-sm font-semibold text-card-foreground"
                      >
                        Cause{" "}
                        <span className="text-destructive">*</span>
                      </Label>

                      <div className="group relative">
                        <FiAlertTriangle className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />

                        <Input
                          id={field.name}
                          placeholder="e.g. Equipment Failure"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          className="h-11 rounded-xl border-border bg-background pl-10 text-sm shadow-none transition-all placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15 dark:bg-background"
                          autoComplete="off"
                        />
                      </div>

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              {/* Area */}
              <form.Field name="areaId">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <Label
                        htmlFor={field.name}
                        className="mb-2 block text-sm font-semibold text-card-foreground"
                      >
                        Affected Area{" "}
                        <span className="text-destructive">*</span>
                      </Label>

                      <div className="group relative">
                        <FiGrid className="pointer-events-none absolute left-3.5 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />

                        <select
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          disabled={areaPending}
                          className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-border bg-background pl-10 pr-10 text-sm shadow-none transition-all focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-background"
                        >
                          <option value="" disabled>
                            {areaPending
                              ? "Loading areas..."
                              : "Select affected area"}
                          </option>

                          {areas.map((area: any) => (
                            <option key={area.id} value={area.id}>
                              {area.name} ({area.code})
                            </option>
                          ))}
                        </select>

                        <FiChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      </div>

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              {/* Description - Full Width */}
              <form.Field name="description">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field
                      data-invalid={isInvalid}
                      className="sm:col-span-2"
                    >
                      <Label
                        htmlFor={field.name}
                        className="mb-2 block text-sm font-semibold text-card-foreground"
                      >
                        Description{" "}
                        <span className="text-destructive">*</span>
                      </Label>

                      <div className="group relative">
                        <FiFileText className="pointer-events-none absolute left-3.5 top-4 size-4 text-muted-foreground transition-colors group-focus-within:text-primary" />

                        <Textarea
                          id={field.name}
                          placeholder="Describe the power outage..."
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          className="min-h-32 rounded-xl border-border bg-background pl-10 pt-3.5 text-sm shadow-none transition-all placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15 dark:bg-background"
                        />
                      </div>

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </div>
          </FieldGroup>
        </div>

        {/* Footer */}
        <div className="relative border-t border-border bg-muted/30 px-6 py-5 sm:px-8">
          <p className="mb-3 text-xs text-muted-foreground">
            Please provide accurate information about the outage before
            submitting.
          </p>

          <Button
            type="submit"
            disabled={reportOutagePending || areaPending}
            className="h-11 w-full cursor-pointer rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {reportOutagePending && <Spinner />}
            {reportOutagePending
              ? "Reporting Outage..."
              : "Report Outage"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ReportOutageForm;