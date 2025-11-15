export function RoleSelector({ value, onChange, name }) {
    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-3">
                Select your role
            </label>
            <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name={name}
                        value="buyer"
                        checked={value === "buyer"}
                        onChange={onChange}
                        className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">Buyer</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        name={name}
                        value="seller"
                        checked={value === "seller"}
                        onChange={onChange}
                        className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">Seller</span>
                </label>
            </div>
        </div>
    );
}