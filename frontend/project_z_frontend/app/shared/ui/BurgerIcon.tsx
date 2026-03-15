interface Props{
    action:()=>void;
    isOpen:boolean;
}

const BurgerIcon: React.FC<Props> = ({action,isOpen})=> {
    
    return (
        <div className={`burger ${isOpen?"active":""}`} onClick={action}>
			<span></span>
			<span></span>
			<span></span>
		</div>
    )
};

export default BurgerIcon;