import { Fine, Panel, PanelHead, PanelTitle, Prose, RecordFig } from '../styled_components/Voyager.styled';

export function GoldenRecord() {
  return (
    <Panel>
      <PanelHead>
        <PanelTitle>The Golden Record</PanelTitle>
      </PanelHead>
      <RecordFig>
        <img src="/voyager/golden-record-pia14113.jpg" alt="The gold-plated copper record and its engraved cover, mounted on the side of Voyager" loading="lazy" />
      </RecordFig>
      <Prose>
        A 12-inch gold-plated copper phonograph record bolted to the side of the spacecraft: <strong>115 images</strong>,
        greetings in <strong>55 languages</strong>, sounds of Earth, and <strong>90 minutes of music</strong>, from
        Bach and Beethoven to Chuck Berry and Blind Willie Johnson.
      </Prose>
      <Prose>
        The cover is the instruction manual. It shows how to play the record and decode its pictures, and it
        locates the Sun among 14 pulsars, using the hydrogen atom's flip as a unit of time and length.
      </Prose>
      <Fine>Image: NASA/JPL-Caltech (PIA14113)</Fine>
    </Panel>
  );
}
