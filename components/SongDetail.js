import React from 'react';
import { connect } from 'react-redux';

const SongDetail = ({song}) => {
    if (song) {
        return (
            <div>
                <div>{song.title}</div>
                <div>{song.duration}</div>
            </div>
        );
    };
    return <div>No Song Selected</div>;
}

const mapStateToProps = (state) => {
    return { song: state.selectedSong };
}

export default connect(mapStateToProps)(SongDetail);