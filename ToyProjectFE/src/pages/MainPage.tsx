import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { type UserProfileResponseDto, getUserProfile } from '../api/users';

const posts = [
  {
    id: 1,
    title: '다양한 사람과 소통하기',
    href: '/chat-make',
    description:
      '다른 사람을 초대할 수 있고, 비밀 채팅방 또는 공개 채팅방을 만들 수 있습니다.',
    datetime: '2020-03-16',
    category: { title: 'Group' },
  },
  {
    id: 2,
    title: 'AI와 함께하는 채팅',
    href: '#',
    description:
      'AI와 함께 채팅을 하며 다양한 주제에 대해 이야기해보세요.',
    datetime: '2020-03-16',
    category: { title: 'AI' },
  },

]


const MainPage = () => {
  const navigate = useNavigate();

return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="block mx-auto max-w-2xl">
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl text-center">시작하기</h2>
          <p className="mt-2 text-lg/8 text-gray-600">새로운 채팅방을 만들거나 기존 채팅방에 참여하세요.</p>
        </div>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 justify-center">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex max-w-xl flex-col items-center justify-between cursor-pointer mx-auto"
            >
              <div className="flex items-center gap-x-4 text-xs">
                <time dateTime={post.datetime} className="text-gray-500">
                </time>
                <a
                  className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                >
                  {post.category.title}
                </a>
              </div>
              <div className="group relative grow">
                <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
                  <a onClick={() => navigate(`${post.href}`)}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </a>
                </h3>
                <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600">{post.description}</p>
              </div>
              <div className="relative mt-8 flex items-center gap-x-4 justify-self-end">
                <div className="text-sm/6">
                  <p className="font-semibold text-gray-900">
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MainPage;
