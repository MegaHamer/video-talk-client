import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-200">
      <div className="flex w-80 flex-col items-start rounded-2xl bg-white p-3.5 backdrop-blur-2xl">
        <Link href={"/"} className="mb-1.5 text-sm/tight">
          Назад
        </Link>
        <div className="flex w-full flex-col gap-3 py-2">
          <span className="text-center text-xl/tight">
            Такой комнаты не существует, проверьте правильность идентификатора или создайте новую встречу
          </span>
        </div>
      </div>
    </div>
  )
}