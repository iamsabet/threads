interface UsersSuggestionsProps {
    usersList: UserType[],
    parseFoundText: Function
    selectUsername: Function
    hoverOnItem: Function,
    boxPosition: { x: number, y: number }
    autoCompleteNavigator: number,

}