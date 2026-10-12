import apiClient from "@/lib/apiClient";
import type { ILoginPayload, IRegisterPayload, ITechnicanPayload, IUpdateTechProfilePayload, IUpdateUserStatus, IVerifyEmailPayload } from "@/types";

export function userLogin(payload:ILoginPayload){
    
    return apiClient("/auth/login",{
        method:"POST",
        body:payload
    })
}

export function googleLogin(payload: { idToken: string ,role?:"ADMIN" | "CUSTOMER" | "TECHNICIAN"}){
    return apiClient("/auth/google-login",{
        method:"POST",
        body:payload
    })
}



//register


export function registerUser(payload:IRegisterPayload){
return apiClient("/auth/register",{
    method:"POST",
    body:payload
})
}


export function userLogout(){
    return apiClient("/auth/logout",{method:"POST"})
}


//verify user email



export function verifyUserEmail(payload:IVerifyEmailPayload){
    return apiClient("/auth/verify-email",{
        method:"POST",
        body:payload
    })
}
//resend verify otp
export function resendOtp(payload:{email:string}){
    return apiClient("/auth/resend-otp",{
        method:"POST",
        body:payload
    })
}

export function getMe(){
    return apiClient("/auth/get-me")
}


//admin get all technician

export function getAllTechnician(){
    return apiClient("/admin/technician")
}



//approve tehnicna profile 

export function approveTechnicanProfile(payload:ITechnicanPayload){
    console.log(payload,"in approve tech profile api payload")
    return apiClient("/technician/update-status",{
        method:"PATCH",
        body:payload
    })
}



//get all users for admin


export function getAllUsers(){
    return apiClient("/admin/users")
}



export function updateUserStatus(payload:IUpdateUserStatus){
    return apiClient(`/admin/users/${payload.userId}`,{
        method:"PATCH",
        body:{
            status:payload.status
        }
    })
}






//technician profile update

export function updateTechProfile(payload: IUpdateTechProfilePayload) {
    const formData = new FormData();

    formData.append("data", JSON.stringify(payload.data));
    formData.append("resume", payload.resume);

    return apiClient(`/technician`, {
        method: "PATCH",
        body: formData,
    });
}




//update current user profile
export interface IUpdateUserProfile {
    profileImage:File;
    data:{
        name:string
    }
}
export function updateUserProfile(payload:IUpdateUserProfile){
    const formData= new FormData()
    formData.append("profileImage",payload.profileImage)
    formData.append("data",JSON.stringify(payload.data))
    return apiClient("/auth/update-profile",{
        method:"PATCH",
        body:formData
    })
}


export function getTechnicianCount(){
    return apiClient("/auth/technician-count")
}


//reset pasword

//send otp

export function sendForgotPassOtp(payload:{email:string}){
    return apiClient("/auth/forgot-password-otp",{
        method:"POST",
        body:payload
    })
}