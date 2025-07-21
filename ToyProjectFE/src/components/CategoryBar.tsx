import { Link, useLocation } from 'react-router-dom';

const CategoryBar = () => {
  const location = useLocation();
  
  const categories = [
    { name: '개인 채팅', path: '/chat/personal' },
    { name: '그룹 채팅', path: '/chat/group' },
    { name: '공개 채널', path: '/chat/public' },
    { name: '알림 센터', path: '/notifications' },
    { name: '파일 보관함', path: '/files' },
  ];
  
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto scrollbar-hide py-3 -mx-2">
          {categories.map((category) => (
            <Link
              key={category.path}
              to={category.path}
              className={`whitespace-nowrap px-5 py-2 mx-1 text-sm font-medium rounded-full transition-colors ${
                location.pathname.includes(category.path)
                ? 'bg-indigo-100 text-indigo-800'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
