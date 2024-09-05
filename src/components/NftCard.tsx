type TData = {
  title: string
  image: string
  description: string
  attributes?: any[];
}

const NftCard = (data: TData) => {
  return (
    <div className="w-80 rounded-lg overflow-hidden shadow-lg bg-gray-800 text-white m-2">
      <img className="w-full h-60 object-cover" src={data.image} alt={data.title} />
      <div className="px-3 py-2">
        <div className="font-bold text-xl mb-2">{data.title}</div>
        <p className="text-gray-400 text-sm line-clamp-3" title={data.description}>{data.description}</p>
        {
          data.attributes ? (
            <div className="mt-2">
              {
                data.attributes.map((attr, index) => (
                  <div key={index} className="flex justify-between mb-1">
                    <span className="text-sm text-gray-500">{attr.type || attr.trait_type}</span>
                    <span className="text-sm text-gray-400 text-right">{attr.value}</span>
                  </div>
                ))
              }
            </div>
          ) : null
        }
      </div>
    </div>
  )
}

export default NftCard