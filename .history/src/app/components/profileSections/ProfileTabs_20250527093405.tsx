import Watchlist from "./userWatchlist";
import Comments from "./userComments";
import Diary from "./userDiary";

interface ProfileTabsProps {
  userId: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ userId, activeTab, setActiveTab }) => {
  return (
    <div className="border rounded-xl shadow-md">
      <div className="flex border-b">
        {[
          { id: "watchlist", label: "📺 Watchlist" },
          { id: "comments", label: "💬 Comments" },
          { id: "diary", label: "📖 Diary" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === tab.id
                ? "border-b-4 border-[#22ec8a] text-[#22ec8a]"
                : "text-gray-500 hover:text-[#22ec8a]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeTab === "watchlist" && <Watchlist userId={userId} />}
        {activeTab === "comments" && <Comments userId={userId} />}
        {activeTab === "diary" && <Diary userId={userId} />}
      </div>
    </div>
  );
};

export default ProfileTabs;
