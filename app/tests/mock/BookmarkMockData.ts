import { PhotoInformation } from '../../dtos/PhotoInformation';
import { VideoInformation } from '../../dtos/VideoInformation';
import { Bookmark } from '../../entities/Bookmark';

export const PhotoInformationMock = (mock?: Partial<PhotoInformation>) =>
  new PhotoInformation({
    title: '2018 Visite de Klaxoon',
    author: 'Pierre Metivier',
    thumbnail:
      'https://live.staticflickr.com/4817/45771361701_2678123510_q.jpg',
    type: 'photo',
    width: 1024,
    height: 685,
    uploadDate: undefined,
    description: undefined,
    ...mock,
  });

export const PhotoBookmarkMock = (mock?: Partial<Bookmark>) =>
  new Bookmark({
    id: 1,
    information: PhotoInformationMock(),
    link: 'https://www.flickr.com/photos/feuilllu/45771361701/',
    ...mock,
  });

export const VideoInformationMock = (mock?: Partial<VideoInformation>) =>
  new VideoInformation({
    title: 'Sylvain Lhommée @ Nation Entreprenante - Episode #5',
    description:
      "Dans Nation entreprenante, on ne tourne pas autour du pot ! On vous aide à explorer de nouveaux usages pour une économie plus circulaire et solidaire.\n\nIl est possible de se développer sans dépenser, de mutualiser pour évoluer durablement. Et si nous en faisions une valeur ajoutée ?\n\nSylvain Lhommée et Marc Evenisse évoquent ces pratiques ancestrales qui font du bien à notre futur avec Nicolas Celier, notre expert du jour, et Raphaëlle Duchemin, dans ce nouveau numéro de Nation entreprenante, enregistré au Klaxoon Store (Paris 2ème).\n\nDans ce numéro également, Les Poteries d'Albi et Circul'Egg.\n\nNotre expert fil rouge :  Nicolas Celier, Co-fondateur de Ring Capital. Sylvain Lhommée, CEO Fondateur de BarterLink et Marc Evenisse, Fondateur de Furion Motorcycles et VP de Le Mans Tech partagent leur vision sur le sujet.\n\nInvestir ? Fédérer ? Comment faire de chaque crise une chance ?\n\nEt si on relançait l'économie en échangeant une compétence, un savoir-faire, un matériel ou des m2 vides contre un service ou un bien dont on a besoin ? Relocaliser nécessite parfois de mettre en commun des moyens. Humain, financier ou immobilier, nous avons tous un élément précieux à partager.\n\nSylvain Lhommée nous explique comment on peut, grâce au Bartering, préserver sa trésorerie, tout en développant son réseau. Marc Evenisse donne d'autres exemples concrets qui abondent dans le sens du partage et de l'échange.",
    author: 'BARTERLINK',
    thumbnail:
      'https://i.vimeocdn.com/video/1169280957-6513b97be812eac51f6ba090b2f34ab5a63bfc220076c0118950fcf4c227fdce-d_295x166',
    uploadDate: new Date('2021-06-21T00:42:24.000Z'),
    type: 'video',
    width: 426,
    height: 240,
    duration: 1070,
    ...mock,
  });

export const VideoBookmarkMock = (mock?: Partial<Bookmark>) =>
  new Bookmark({
    id: 2,
    link: 'https://vimeo.com/565486457',
    information: VideoInformationMock(),
    ...mock,
  });

export const BookmarksMock = [PhotoBookmarkMock(), VideoBookmarkMock()];
