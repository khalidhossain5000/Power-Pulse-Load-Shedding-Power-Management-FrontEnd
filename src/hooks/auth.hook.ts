import { approveTechnicanProfile, getAllTechnician, getAllUsers, getMe, getTechnicianCount, googleLogin, registerUser, resendOtp, sendForgotPassOtp, updateTechProfile, updateUserProfile, updateUserStatus, userLogin, userLogout, verifyUserEmail } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useLogin(){
    return useMutation({
        mutationFn:userLogin
    })
}


export function useGoogleLogin(){
    return useMutation({
        mutationFn:googleLogin
    })
}



export function useRegisterUser(){
    return useMutation({
        mutationFn:registerUser
    })
}


export function useLogout(){
    return useMutation({
        mutationFn:userLogout
    })
}


export function useVerifyEmail(){
    return useMutation({
        mutationFn:verifyUserEmail
    })
}


export function useResendOtp(){
    return useMutation({
        mutationFn:resendOtp
    })
}



export function useGetMe(){
    return useQuery({
        queryKey:["user"],
        queryFn:getMe,
        retry:false
    })
}


export function useGetAllTechnician(){
      return useQuery({
        queryKey:["technican"],
        queryFn:getAllTechnician,
        retry:false
    })
}



export function useApproveTechnician(){
        const queryClient = useQueryClient()
    return useMutation({
        mutationFn:approveTechnicanProfile,
          onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["technican"]})
    }
    })
}



export function useGetAllUsers(){
    return useQuery({
        queryKey:["all-users"],
        queryFn:getAllUsers
    })
}



export function useUpdateUserStatus(){
      const queryClient = useQueryClient()

    return useMutation({
        mutationFn:updateUserStatus,
        onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["all-users"]})
    }
  
    })
}



export function useUpdateTechnicianProfile(){
     const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTechProfile,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });
}



export function useUpdateUserProfile(){
      const queryClient = useQueryClient();

    return useMutation({
        mutationFn:updateUserProfile,
         onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
    })
}

export function useGetTechnicianCount(){
    return useQuery({
        queryKey:["technician-count"],
        queryFn:getTechnicianCount
    })
}



export function useSendForgotPassOtp(){
    return useMutation({
            mutationFn:sendForgotPassOtp,
    })
}