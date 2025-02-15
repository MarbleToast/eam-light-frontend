import React from 'react';
import FontIcon from '@material-ui/core/Icon';
import EAMBarcodeInput from "eam-components/dist/ui/components/muiinputs/EAMBarcodeInput";
import EAMCheckbox from "eam-components/dist/ui/components/muiinputs/EAMCheckbox";

const SEARCH_TYPES = {
    PART: {
        text: "Parts",
        value: "PART",
        code: "PART",
    },
    EQUIPMENT_TYPES: {
        text: "Equipment",
        value: "A,P,S,L",
        code: "EQUIPMEN",
    },
    JOB: {
        text: "Work Orders",
        value: "JOB",
        code: "JOB",
    }
}

const searchIconStyle = {
    color: "#02a2f2",
    fontSize: 25,
    position: "absolute",
    right: -4,
    top: 5
};

const PHONE_SCREEN_WIDTH = 455;

export default class SearchHeader extends React.Component {

    state = {
        searchOn: Object.values(SEARCH_TYPES).map(v => v.value),
        isPhoneScreen: false,
    };

    updateWidth = () => {
        this.setState({ isPhoneScreen: this.searchBoxDiv?.clientWidth < PHONE_SCREEN_WIDTH });
    };

    componentDidMount() {
        this.searchInput.focus();
        this.updateWidth();
        window.addEventListener('resize', this.updateWidth);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWidth);
    }

    renderTypeCheckbox(searchType) {
        const { searchOn, setState } = this.state;
        return <EAMCheckbox
                key={searchType.code}
                elementInfo={{text: searchType.text}}
                value={searchOn.includes(searchType.value).toString()}
                updateProperty={() => {
                    this.setState(
                        {
                            searchOn: searchOn.includes(searchType.value) ?
                            searchOn.filter(val => val !== searchType.value)
                            : [...searchOn, searchType.value]
                        }
                        , () => this.handleSearchInput({target: {value: this.props.keyword}})
                    )
                }}
            />
    }

    renderIcon = () => (
        <>
            <img src="images/eamlight_logo.png" alt="EAM Light Logo" style={{paddingLeft: 20}}/>
            <div style={{width: 10}}></div>
            <div id="searchBoxLabelGreeting" className={this.props.searchBoxUp ? "searchBoxLabelGreetingSearch" : "searchBoxLabelGreetingHome" }>
                <span className="FontLatoBlack Fleft Fs30 DispBlock" style={{color: "#02a2f2"}}>Welcome to EAM Light</span>
            </div>
        </>
    );

    renderInput = () => {
        const entityTypes = this.state.searchOn.join(',');
        return (
            <EAMBarcodeInput updateProperty={val => this.props.fetchDataHandler(val, entityTypes)} top={3} right={-7}>
                <input
                    onInput={this.handleSearchInput.bind(this)}
                    id="searchInputText"
                    onKeyDown={this.props.onKeyDown}
                    value={this.props.keyword}
                    style={{textTransform: "uppercase"}}
                    ref={(input) => { this.searchInput = input; }} />
            </EAMBarcodeInput>
        );
    };

    renderFilters = () => {
        const { showTypes } = this.props;
        return (
            <>
                <FontIcon style={searchIconStyle} className="fa fa-search"/>
                {   
                    showTypes &&
                        <div className='searchTypes' style={this.state.isPhoneScreen ? { flexDirection: 'column', height: 'auto' } : {}}>
                            {Object.values(SEARCH_TYPES).map(this.renderTypeCheckbox.bind(this))}
                        </div>
                }
                <label id="searchPlaceHolder">{!this.props.keyword && "Search for Equipment, Work Orders, Parts, ..."}</label>
            </>
        );
    }

    render() {
        return (
            <div
                id="searchBox"
                className={this.props.searchBoxUp ? "searchBox searchBoxSearch" : "searchBox searchBoxHome"}
                ref={searchBoxDiv => this.searchBoxDiv = searchBoxDiv}
                style={this.props.searchBoxUp && this.state.isPhoneScreen ? { height: 'fit-content', paddingTop: '5px', paddingBottom: '5px' } : {}}
            >
                {
                    this.props.searchBoxUp && this.state.isPhoneScreen ?
                    <div id="searchBoxInput" className="searchBoxInputSearch" style={{ width: '100%'}}>
                        {this.renderInput()}
                        <div id="searchBoxLabel" className="searchBoxLabelHome" style={{ justifyContent: 'left'}}>
                            {this.renderIcon()}
                            {this.renderFilters()}
                        </div>
                    </div> :
                    <>
                        <div id="searchBoxLabel" className="searchBoxLabelHome">
                            {this.renderIcon()}
                        </div>
                        <div id="searchBoxInput" className={this.props.searchBoxUp ? "searchBoxInputSearch" : "searchBoxInputHome" }>
                            {this.renderInput()}
                            {this.renderFilters()}
                        </div>
                    </>
                }
            </div>
        );
    }

    handleSearchInput = (event) => {
        this.props.fetchDataHandler(event.target.value, this.state.searchOn.join(','));
    }
}
