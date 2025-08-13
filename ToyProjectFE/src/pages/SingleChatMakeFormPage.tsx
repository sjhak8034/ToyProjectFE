import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/auth';

export default function SingleChatMakeFormPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const data = {
      roomName: form['room-name'].value,
      // 필요시 추가 필드
    };

    console.log('Form data:', data);

    api.post('/rooms/single', data)
      .then(response => {
        console.log('채팅방 생성 성공:', response.data);
        alert('채팅방이 성공적으로 생성되었습니다!');
        navigate('/rooms/' + response.data.id); // 생성된 채팅방으로 이동
      })
      .catch(error => {
        console.error('채팅방 생성 실패:', error);
        // 실패 처리 로직 추가 가능
      });
    // 성공/실패 처리 추가 가능
  };

  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >

      </div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">그룹 채팅</h2>
        <p className="mt-2 text-lg/8 text-gray-600">채팅방을 설정하세요 비밀번호 입력시 비밀 채팅방으로 설정됩니다.</p>
      </div>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="mx-auto mt-16 max-w-xl sm:mt-20"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label htmlFor="room-name" className="block text-sm/6 font-semibold text-gray-900">
              채팅방 이름
            </label>
            <div className="mt-2.5">
              <input
                id="room-name"
                name="room-name"
                type="text"
                autoComplete="given-name"
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />
            </div>
          </div>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Let's talk
          </button>
        </div>
      </form>
    </div>
  )
}
