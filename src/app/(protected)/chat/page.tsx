'use client'
export default function FriendsPage() {
  const handleJoinClick = () => {
    //хук для присоединения к комнате по id

    //при положительном результате - перейти в комнату

    //при ошибке вывести текст об ошибке
  };
  const handleCreateClick = () => {
    //переход в форму создания

  };
  return (
    <>
      <div className="max-w-96 min-w-64 rounded-xl bg-white p-1.5">
        <div>
          <button
            onClick={handleJoinClick}
            className="w-full rounded-xl bg-blue-500 px-4 py-2 text-xl/tight font-semibold text-white transition hover:bg-blue-600 active:bg-blue-400"
          >
            Присоединится
          </button>
          <div>
            <input className=""></input>
          </div>
        </div>
        <button
          onClick={handleCreateClick}
          className="w-full rounded-xl bg-blue-500 px-4 py-2 text-xl/tight font-semibold text-white transition hover:bg-blue-600 active:bg-blue-400"
        >
          Организовать
        </button>
      </div>
    </>
  );
}
