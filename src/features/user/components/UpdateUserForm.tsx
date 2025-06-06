"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateUserFormData, updateUserSchema } from "../shemes/user.shema";
import api from "@/shared/api/axios";
import { constrainedMemory } from "process";
import { useMyProfile } from "@/features/friends/hooks/useGetMyProfile";
import { useEffect, useState } from "react";

interface UpdateUserFormProps {
  onSuccess?: () => void;
}

export function UpdateUserForm({ onSuccess }: UpdateUserFormProps) {
  const queryClient = useQueryClient();
  const { data: Profile, isSuccess, isPending } = useMyProfile();
  const [globalName, setGlobalName] = useState(Profile?.globalName || "");

  useEffect(() => {
    if (isSuccess) {
      setGlobalName(Profile?.globalName || "");
    }
  }, [isSuccess, Profile?.username]);

  const avatar_url = Profile?.avatar
    ? process.env.SERVER_URL + Profile?.avatar
    : "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      globalName: globalName,
    },
  });
  const avatarPreview = watch("avatar")?.[0]
    ? URL.createObjectURL(watch("avatar")[0])
    : avatar_url;

  const updateUserMutation = useMutation({
    mutationFn: async (data: UpdateUserFormData) => {
      const formData = new FormData();
      formData.append("globalName", data.globalName);
      if (data.avatar?.[0]) {
        formData.append("avatar", data.avatar[0]);
      }
      console.log(data);

      return api
        .put(`/users/me`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my_profile"] });
      onSuccess?.();
    },
  });

  const onSubmit = handleSubmit((data) => {
    console.log("Данные формы:", data);
    updateUserMutation.mutate(data);
  });

  const handlerImgClick  = ()=>{

  }

  return (
    <form onSubmit={(e) => onSubmit(e)} className="mx-auto max-w-md space-y-4">
      <div className="flex flex-col items-center">
        {avatarPreview && (
          <img
            src={avatarPreview}
            alt="Аватар"
            className="mb-4 h-40 w-40 rounded-full object-cover"
            onClick={handlerImgClick}
          />
        )}
        <label className="cursor-pointer">
          <span className="mb-1 block text-sm font-medium text-gray-200">
            Аватар
          </span>
          <input
            type="file"
            accept="image/*"
            {...register("avatar")}
            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </label>
      </div>

      <div>
        <label
          htmlFor="globalName"
          className="block text-sm font-medium text-gray-200"
        >
          Отображаемое имя
        </label>
        <input
          id="globalName"
          type="text"
          {...register("globalName")}
          className="mt-1 block w-full border-b-2 border-gray-300 p-1 text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={globalName}
          onChange={(e)=>setGlobalName(e.target.value)}
        />
        {errors.globalName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.globalName.message}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
        >
          Сбросить
        </button>
        <button
          type="submit"
          disabled={updateUserMutation.isPending}
          className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {updateUserMutation.isPending ? "Сохранение..." : "Сохранить"}
        </button>
      </div>
    </form>
  );
}
