export function DrawerToggleButton({ className = "" }: { className?: string }) {
    return (
        <label htmlFor="my-drawer" className={`btn btn-white drawer-button ${className}`}>
           <img
                src="/images/bubble-discussion.svg"
                alt="Menu"
                className="w-6 h-6" // Tailwind: 24x24px
                // style={{ width: 24, height: 24 }} // 직접 스타일 지정도 가능
            />
        </label>
    );
}



export default function Drawer() {

    

    return (
        <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    {/* Sidebar content here */}
                    <li><a>Sidebar Item 1</a></li>
                    <li><a>Sidebar Item 2</a></li>
                </ul>
            </div>
        </div>
    );
}

