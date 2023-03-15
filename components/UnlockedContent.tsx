import React from 'react';
import UnlockedText from './UnlockedText';
import UnlockedClaim from './UnlockedClaim';
import ParagraphText from './ParagraphText';

export default function UnlockedContent() {
    return (
        <>
            <ParagraphText text="The vault door swung wide open!" />
            <UnlockedClaim />
        </>
    )
}