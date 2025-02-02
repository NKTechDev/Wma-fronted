

export const useCntainerDiminsions = ()=>{
    const [conatinerDimensions,setContainerDimension] =useState(null)

    const onContainerLayout = ()=>{
        const { width,height } =Event.nativeEvent.layout

        setContainerDimensions({ width, height })
    }

    return { containerDimensions, onContainerLayout }
 
}