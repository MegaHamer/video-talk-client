import Input from "@/shared/components/ui/Input";

export default function FriendSearchForm() {
    const onSubmit=()=>{

    }
  return (
    <div className="flex flex-col gap-3 p-3">
      <div>
        <h1 className="text-xl/tight">Добавить в друзья</h1>
        <p className="text-base/tight">
          Вы можете добавить друзей по имени пользователя
        </p>
      </div>
      <div className="">
        <form onSubmit={onSubmit}>
          <div className="relative">
            <Input type="text" />
            <button
              type="submit"
              className="absolute top-1/2 right-2 -translate-y-1/2 text-background rounded-lg bg-blue-400 px-2 py-1"
            >
              Найти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
